import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DatasetItem } from 'src/app/interfaces/dataset-item';
import { DatasetService } from 'src/app/services/dataset.service';
import { HandDetectionService } from 'src/app/services/hand-detection.service';
import { SignClassificationService } from 'src/app/services/sign-classification.service';
import { WebcamService } from 'src/app/services/webcam.service';


@Component({
  selector: 'app-training-step2-page',
  templateUrl: './training-step2-page.component.html',
  styleUrls: ['./training-step2-page.component.css']
})
export class TrainingStep2PageComponent implements OnInit {

  item: DatasetItem;
  VIDEO: HTMLVideoElement;
  CANVAS_ELEMENT: HTMLCanvasElement;
  ENABLE_CAM_BUTTON: HTMLElement;
  DATA_COLLECT_BUTTON: HTMLElement;
  TRAIN_BUTTON: HTMLElement;
  RESET_BUTTON: HTMLElement;
  DOWNLOAD_BUTTON: HTMLElement;
  collectingData: boolean;


  constructor(
    private webcamService: WebcamService,
    private handDetectionService: HandDetectionService,
    private signClassificationService: SignClassificationService,
    private datasetService: DatasetService,
    private route: ActivatedRoute
    ) {}

  ngOnInit() {

    this.route.paramMap.subscribe(params => {
      let index = parseInt(params.get('index'));
      this.item = this.datasetService.getItem(index);
      console.log('item index: '+index);
    });
    
    this.initControls();

    this.signClassificationService.setCanvas(this.CANVAS_ELEMENT);


    this.ENABLE_CAM_BUTTON.addEventListener('click', this.enableCam);
    this.DATA_COLLECT_BUTTON.addEventListener('click', this.dataCollect);
    this.TRAIN_BUTTON.addEventListener('click', this.trainAndPredict);
    this.RESET_BUTTON.addEventListener('click', this.reset);
    this.DOWNLOAD_BUTTON.addEventListener('click', this.download);

  }

  initControls() {
    this.VIDEO = <HTMLVideoElement>document.getElementById('webcam');
    this.CANVAS_ELEMENT = <HTMLCanvasElement>document.getElementById("output_canvas");
    this.ENABLE_CAM_BUTTON = document.getElementById('enableCam');
    this.DATA_COLLECT_BUTTON = document.getElementById('dataCollector');
    this.TRAIN_BUTTON = document.getElementById('train');
    this.RESET_BUTTON = document.getElementById('reset');
    this.DOWNLOAD_BUTTON = document.getElementById('download');
  }

  enableCam = async () => {
    try {
      await this.webcamService.initializeCamera(this.VIDEO);
      this.ENABLE_CAM_BUTTON.classList.add('removed');
      this.handDetectionService.startHandsDetection(this.VIDEO, this.CANVAS_ELEMENT);
    } catch (error) {
      console.error('Error initializing app:', error);
    }
  }

  trainAndPredict = async () => {
    await this.signClassificationService.train();
    this.signClassificationService.predict();
  }

  reset = () => {
    this.signClassificationService.reset();
  }

  dataCollect = () => {
    this.collectingData = !this.collectingData;

    if (this.collectingData) {
      this.signClassificationService.startDataCollection(this.item.index);
    } else {
      this.signClassificationService.stopDataCollection();
    }
  }

  download = async () => {
    let url = await this.signClassificationService.save('mi-modelo-entrenado');
    console.log('modelo descargado en: '+url);
  }

}
