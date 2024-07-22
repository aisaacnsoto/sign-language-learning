import { Component, OnInit } from '@angular/core';

import { HandDetectionService } from './services/hand-detection.service';
import { WebcamService } from './services/webcam.service';
import { SignClassificationService } from './services/sign-classification.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {

  VIDEO: HTMLVideoElement;
  CANVAS_ELEMENT: HTMLCanvasElement;
  ENABLE_CAM_BUTTON: HTMLElement;
  RESET_BUTTON: HTMLElement;
  TRAIN_BUTTON: HTMLElement;
  collectingData: boolean;


  constructor(
    private webcamService: WebcamService,
    private handDetectionService: HandDetectionService,
    private signClassificationService: SignClassificationService
    ) {}

  ngOnInit() {
    
    this.initControls();

    this.signClassificationService.setCanvas(this.CANVAS_ELEMENT);


    this.ENABLE_CAM_BUTTON.addEventListener('click', this.enableCam);
    this.TRAIN_BUTTON.addEventListener('click', this.trainAndPredict);
    this.RESET_BUTTON.addEventListener('click', this.reset);

    let dataCollectorButtons = document.querySelectorAll('button.dataCollector');
    for (let i = 0; i < dataCollectorButtons.length; i++) {
      dataCollectorButtons[i].addEventListener('click', this.gatherDataForClass);
      this.signClassificationService.addClass(dataCollectorButtons[i].getAttribute('data-name'));
    }
    

  }

  initControls() {
    this.VIDEO = <HTMLVideoElement>document.getElementById('webcam');
    this.CANVAS_ELEMENT = <HTMLCanvasElement>document.getElementById("output_canvas");
    this.ENABLE_CAM_BUTTON = document.getElementById('enableCam');
    this.RESET_BUTTON = document.getElementById('reset');
    this.TRAIN_BUTTON = document.getElementById('train');
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

  gatherDataForClass = (el) => {
    this.collectingData = !this.collectingData;

    if (this.collectingData) {
      let classNumber = parseInt(el.target.getAttribute('data-1hot'));
      this.signClassificationService.startDataCollection(classNumber);
    } else {
      this.signClassificationService.stopDataCollection();
    }
  }

}
