import { Injectable } from '@angular/core';
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils';
import { HAND_CONNECTIONS } from '@mediapipe/hands';
import { HandLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';

@Injectable({
  providedIn: 'root'
})
export class HandDetectionService {

  private handLandmarker: HandLandmarker;
  private videoElement: HTMLVideoElement;
  private canvasElement: HTMLCanvasElement;

  constructor() {
    this.createHandLandmarker();
  }

  private async createHandLandmarker() {
    let vision = await FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm");
    this.handLandmarker = await HandLandmarker.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath: `https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task`,
        delegate: "GPU"
      },
      runningMode: "VIDEO",
      numHands: 2
    });
  }

  startHandsDetection(videoElement: HTMLVideoElement, canvasElement: HTMLCanvasElement) {
    this.videoElement = videoElement;
    this.canvasElement = canvasElement;

    this.handsDetectionLoop();
  }

  private handsDetectionLoop = () => {
    let canvasCtx = this.canvasElement.getContext("2d");
    let position = this.videoElement.getBoundingClientRect();
    this.canvasElement.style.top = position.top + 'px';
    this.canvasElement.style.left = position.left + 'px';
    this.canvasElement.style.width = this.videoElement.videoWidth.toString();
    this.canvasElement.style.height = this.videoElement.videoHeight.toString();
    this.canvasElement.width = this.videoElement.videoWidth;
    this.canvasElement.height = this.videoElement.videoHeight;

    let startTimeMs = performance.now();
    let results = this.handLandmarker.detectForVideo(this.videoElement, startTimeMs);

    canvasCtx.save();
    canvasCtx.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);
    if (results.landmarks) {
      for (const landmarks of results.landmarks) {
        drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS, {
          color: "#00FF00",
          lineWidth: 5
        });
        drawLandmarks(canvasCtx, landmarks, { color: "#FF0000", lineWidth: 2 });
      }
    }
    canvasCtx.restore();

    window.requestAnimationFrame((this.handsDetectionLoop));
  }

}
