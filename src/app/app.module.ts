import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HandDetectionService } from './services/hand-detection.service';
import { WebcamService } from './services/webcam.service';
import { SignClassificationService } from './services/sign-classification.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [WebcamService, SignClassificationService, HandDetectionService],
  bootstrap: [AppComponent]
})
export class AppModule { }
