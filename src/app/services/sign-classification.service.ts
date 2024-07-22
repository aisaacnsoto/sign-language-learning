import { Injectable } from '@angular/core';
import * as tf from '@tensorflow/tfjs';

@Injectable({
  providedIn: 'root'
})
export class SignClassificationService {

  private model: tf.Sequential;

  private collectingData: boolean;
  private predicting: boolean;
  private CLASS_NAMES = [];
  private canvasElement: HTMLCanvasElement;
  private classNumber: number;

  private mobilenet: tf.GraphModel = undefined;
  private MOBILE_NET_INPUT_WIDTH = 224;
  private MOBILE_NET_INPUT_HEIGHT = 224;
  //gatherDataState = this.STOP_DATA_GATHER;

  private trainingDataInputs = [];
  private trainingDataOutputs = [];
  private examplesCount = [];

  constructor() {
    this.loadMobileNetFeatureModel();
    
  }

  setCanvas(canvasElement: HTMLCanvasElement) {
    this.canvasElement = canvasElement;
  }

  private async loadMobileNetFeatureModel() {
    console.log('Awaiting TF.js load...');
    const URL = 'https://tfhub.dev/google/tfjs-model/imagenet/mobilenet_v3_small_100_224/feature_vector/5/default/1';
    this.mobilenet = await tf.loadGraphModel(URL, { fromTFHub: true });
    console.log('MobileNet v3 loaded successfully!');

    tf.tidy(() => {
      let answer: any = this.mobilenet.predict(tf.zeros([1, this.MOBILE_NET_INPUT_HEIGHT, this.MOBILE_NET_INPUT_WIDTH, 3]));
      console.log(answer.shape);
    });
  }

  private constructModel() {
    this.model = tf.sequential();
    this.model.add(tf.layers.dense({ inputShape: [1024], units: 128, activation: 'relu' }));
    this.model.add(tf.layers.dense({ units: this.CLASS_NAMES.length, activation: 'softmax' }));

    this.model.summary();

    this.model.compile({
      optimizer: 'adam',
      loss: (this.CLASS_NAMES.length === 2) ? 'binaryCrossentropy' : 'categoricalCrossentropy',
      metrics: ['accuracy']
    });
  }

  async train() {
    this.constructModel();

    tf.util.shuffleCombo(this.trainingDataInputs, this.trainingDataOutputs);

    let outputsAsTensor = tf.tensor1d(this.trainingDataOutputs, 'int32');
    let oneHotOutputs = tf.oneHot(outputsAsTensor, this.CLASS_NAMES.length);
    let inputsAsTensor = tf.stack(this.trainingDataInputs);

    let results = await this.model.fit(inputsAsTensor, oneHotOutputs, {
      shuffle: true,
      batchSize: 5,
      epochs: 10,
      callbacks: { onEpochEnd: this.logProgress }
    });

    outputsAsTensor.dispose();
    oneHotOutputs.dispose();
    inputsAsTensor.dispose();
  }

  private logProgress(epoch, logs) {
    console.log('Data for epoch ' + epoch, logs);
  }

  predict() {
    if (!this.predicting) {
      console.log('inciando predicción');
      this.predicting = true;
      this.predictionLoop();
    }
  }

  private predictionLoop = () => {
    if (this.predicting) {
      tf.tidy(() => {
        let imageFeatures = this.calculateFeaturesOnCurrentFrame();
        let modelPredict: any = this.model.predict(imageFeatures.expandDims());
        let prediction = modelPredict.squeeze();
        let highestIndex = prediction.argMax().arraySync();
        let predictionArray = prediction.arraySync();
        let text = 'Prediction: ' + this.CLASS_NAMES[highestIndex] + ' with ' + Math.floor(predictionArray[highestIndex] * 100) + '% confidence';
        console.log(text);
      });
      window.requestAnimationFrame(this.predictionLoop);
    }
  }

  private calculateFeaturesOnCurrentFrame() {
    return tf.tidy(() => {
      let videoFrameAsTensor = tf.browser.fromPixels(this.canvasElement);
      let resizedTensorFrame = tf.image.resizeBilinear(
        videoFrameAsTensor,
        [this.MOBILE_NET_INPUT_HEIGHT, this.MOBILE_NET_INPUT_WIDTH],
        true
      );

      let normalizedTensorFrame = resizedTensorFrame.div(255);

      let prediction: any = this.mobilenet.predict(normalizedTensorFrame.expandDims());
      return prediction.squeeze();
    });
  }

  startDataCollection(classNumber: number) {
    if (!this.collectingData) {
      console.log('iniciando recolección de datos');
      this.collectingData = true;
      this.classNumber = classNumber;

      this._dataCollectionLoop();
    }
  }

  private _dataCollectionLoop = () => {
    if (this.collectingData) {
      let imageFeatures = this.calculateFeaturesOnCurrentFrame();

      this.trainingDataInputs.push(imageFeatures);
      this.trainingDataOutputs.push(this.classNumber);

      if (this.examplesCount[this.classNumber] === undefined) {
        this.examplesCount[this.classNumber] = 0;
      }
      this.examplesCount[this.classNumber]++;

      let text = '';
      for (let n = 0; n < this.CLASS_NAMES.length; n++) {
        text += this.CLASS_NAMES[n] + ' data count: ' + this.examplesCount[n] + '. ';
      }
      console.log(text);

      window.requestAnimationFrame(this._dataCollectionLoop);
    }
  }

  stopDataCollection() {
    this.collectingData = false;
  }

  reset() {
    this.collectingData = false;
    this.predicting = false;
    this.examplesCount.splice(0);
    for (let i = 0; i < this.trainingDataInputs.length; i++) {
      this.trainingDataInputs[i].dispose();
    }
    this.trainingDataInputs.splice(0);
    this.trainingDataOutputs.splice(0);
    console.log('No data collected');

    console.log('Tensors in memory: ' + tf.memory().numTensors);
  }

  addClass(className: string) {
    this.CLASS_NAMES.push(className);
  }

}
