import { Injectable } from '@angular/core';
import { DatasetItem } from '../interfaces/dataset-item';

@Injectable({
  providedIn: 'root'
})
export class DatasetService {

  private dataset: DatasetItem[] = [];

  constructor() {}

  addItem(label: string): void {
    let index = this.dataset.length;
    this.dataset.push({ index, label, images: [], imagesCount: 0 });
  }

  removeItem(index: number): void {
    this.dataset = this.dataset.filter(item => item.index !== index);
  }

  getItem(index: number): DatasetItem {
    return this.dataset.at(index);
  }

  getItems(): DatasetItem[] {
    return this.dataset;
  }

  clearItems(): void {
    this.dataset = [];
  }

  addImageItem(index: number, url: string): void {
    let item = this.dataset.at(index);
    item.images.push(url);
    item.imagesCount = item.images.length;
  }

}
