import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebcamService {

  private videoPlaying: boolean = false;
  private videoElement: HTMLVideoElement;
  private cameraReadySubject = new BehaviorSubject<boolean>(false);
  cameraReady$: Observable<boolean> = this.cameraReadySubject.asObservable();

  constructor() { }
  
  async initializeCamera(videoElement: HTMLVideoElement): Promise<void> {
    try {
      const constraints = {
        video: true,
        width: 640,
        height: 480
      };

      let stream = await navigator.mediaDevices.getUserMedia(constraints);
      videoElement.srcObject = stream;

      return new Promise((resolve) => {
        videoElement.onloadedmetadata = () => {
          //videoElement.play();
          this.videoPlaying = true;
          this.cameraReadySubject.next(true);  // Emitir evento cuando la cámara esté lista
          resolve();
        };
      });
    } catch (err) {
      console.error('Error accessing webcam: ', err);
      throw err;
    }
  }

  stopCamera(videoElement: HTMLVideoElement): void {
    const stream = videoElement.srcObject as MediaStream;
    const tracks = stream.getTracks();

    tracks.forEach(track => track.stop());
    videoElement.srcObject = null;
    this.videoPlaying = false;
    this.cameraReadySubject.next(false);  // Emitir evento cuando la cámara se detiene
  }

  isVideoPlaying(): boolean {
    return this.videoPlaying;
  }


}
