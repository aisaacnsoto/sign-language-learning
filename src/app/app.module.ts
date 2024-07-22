import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HandDetectionService } from './services/hand-detection.service';
import { WebcamService } from './services/webcam.service';
import { SignClassificationService } from './services/sign-classification.service';
import { DatasetService } from './services/dataset.service';
import { TrainingStep1PageComponent } from './pages/training-step1-page/training-step1-page.component';
import { TrainingStep2PageComponent } from './pages/training-step2-page/training-step2-page.component';
import { TrainingStep3PageComponent } from './pages/training-step3-page/training-step3-page.component';
import { TrainingStep4PageComponent } from './pages/training-step4-page/training-step4-page.component';

@NgModule({
  declarations: [
    AppComponent,
    TrainingStep1PageComponent,
    TrainingStep2PageComponent,
    TrainingStep3PageComponent,
    TrainingStep4PageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [
    WebcamService,
    SignClassificationService,
    HandDetectionService,
    DatasetService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
