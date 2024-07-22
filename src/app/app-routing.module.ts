import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TrainingStep1PageComponent } from './pages/training-step1-page/training-step1-page.component';
import { TrainingStep2PageComponent } from './pages/training-step2-page/training-step2-page.component';
import { TrainingStep3PageComponent } from './pages/training-step3-page/training-step3-page.component';
import { TrainingStep4PageComponent } from './pages/training-step4-page/training-step4-page.component';

const routes: Routes = [
  {
    path: 'training-step1',
    component: TrainingStep1PageComponent
  },
  {
    path: 'training-step2/:index',
    component: TrainingStep2PageComponent
  },
  {
    path: 'training-step3',
    component: TrainingStep3PageComponent
  },
  {
    path: 'training-step4',
    component: TrainingStep4PageComponent
  },
  { path: '', redirectTo: '/training-step1', pathMatch: 'full' }, // Redirección predeterminada
  { path: '**', redirectTo: '/training-step1' } // Ruta para manejar errores 404
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
