import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ProgressBarService } from '../../shared/services/progress-bar.service';

import { ProgressBarComponent } from './../../shared/components/progress-bar/progress-bar.component';
import { ExcelDownloadComponent } from '../../shared/components/excel-download/excel-download.component';
import { CameraCaptureComponent } from '../camera-capture/camera-capture.component';

@Component({
  selector: 'app-imageupload',
  imports: [CommonModule, ProgressBarComponent, ExcelDownloadComponent, ReactiveFormsModule, FormsModule, CameraCaptureComponent],
  templateUrl: './imageupload.component.html',
  styleUrl: './imageupload.component.scss',
})
export class ImageuploadComponent implements OnInit {

  private readonly _progressBarService = inject(ProgressBarService);

  attachedFiles: File[] = [];
  isDragging: boolean = false;
  canDownload: boolean = false;
  totalProgress: number = 0;
  theme: string = 'light';
  inputFile: any;

  ngOnInit(): void {
    this.theme = localStorage.getItem('theme') ?? 'light';
    document.documentElement.setAttribute('data-theme', this.theme);
    this._progressBarService.getProgress().subscribe(value => this.totalProgress = value);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (!input.files) return;

    const selectedFiles = Array.from(input.files);
    this.attachedFiles.push(...selectedFiles);
  }


  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent): void {
    this.isDragging = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = false;

    if (event.dataTransfer && event.dataTransfer.files) {
      this.addFiles(event.dataTransfer.files);
    }
  }

  addFiles(fileList: FileList): void {
    const files = Array.from(fileList);
    for (const file of files) {
      if (file.type.startsWith('image/')) {
        this.attachedFiles.push(file);
      }
    }
  }

  getReadableSize(bytes: number): string {
    const kb = bytes / 1024;
    const mb = kb / 1024;
    return mb > 1 ? `${mb.toFixed(2)} MB` : `${kb.toFixed(2)} KB`;
  }

  deleteFile(fileName: string) {
    const index = this.attachedFiles.findIndex(file => file.name === fileName);
    if (index !== -1) {
      this.attachedFiles.splice(index, 1);
    }

    if (this.attachedFiles.length === 0) {
      this.canDownload = false;
      this.totalProgress = 0;
    }
  }

  analyzeFiles() {
    this.canDownload = false;
    this._progressBarService.startProgress();

    setTimeout(() => {
      this._progressBarService.completeProgress();
      this.totalProgress = 0;
      this.canDownload = true;
      this.inputFile = '';
    }, 3000);
  }

  setTheme() {
    const theme = this.theme === 'light' ? 'dark' : 'light';
    this.theme = theme;
    localStorage.setItem('theme', this.theme)
    document.documentElement.setAttribute('data-theme', this.theme);
  }

}
