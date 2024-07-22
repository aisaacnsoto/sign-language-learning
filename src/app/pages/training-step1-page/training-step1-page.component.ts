import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DatasetItem } from 'src/app/interfaces/dataset-item';
import { DatasetService } from 'src/app/services/dataset.service';

@Component({
  selector: 'app-training-step1-page',
  templateUrl: './training-step1-page.component.html',
  styleUrls: ['./training-step1-page.component.css']
})
export class TrainingStep1PageComponent implements OnInit {

  addClassBtn: HTMLElement;
  newNameInput: any;
  dataset: DatasetItem[] = [];

  constructor(private router: Router, private _datasetService: DatasetService) {
    this.dataset = this._datasetService.getItems();
  }

  ngOnInit(): void {
    this.newNameInput = document.getElementById('new-class-name');

    this.addClassBtn = document.getElementById('add-class-btn');
    this.addClassBtn.addEventListener('click', this._addClass);
  }

  private _addClass = () => {
    const className = this.newNameInput.value;
    if (className) {
      this._datasetService.addItem(className);
      this.newNameInput.value = '';
      console.log(this._datasetService.getItems());
    }
  }

  /*redirigir(index) {
    this.router.navigate(['/training-step2/:index']);
  }*/
}
