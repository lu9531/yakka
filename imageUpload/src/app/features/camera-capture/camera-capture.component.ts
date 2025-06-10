import { CommonModule } from '@angular/common';
import { Component, ElementRef, signal, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MenuComponent } from '../menu/menu.component';

@Component({
  selector: 'app-camera-capture',
  imports: [CommonModule, RouterModule, MenuComponent],
  templateUrl: './camera-capture.component.html',
  styleUrl: './camera-capture.component.scss'
})
export class CameraCaptureComponent {

  @ViewChild('videoElement') videoElement!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvasElement') canvasElement!: ElementRef<HTMLCanvasElement>;

  isStreaming = signal(false);
  capturedPhoto = signal<string | null>(null);
  errorMessage = signal<string | null>(null);

  private mediaStream: MediaStream | null = null;

  async startCamera(): Promise<void> {
    try {
      this.errorMessage.set(null);
      const constraints: MediaStreamConstraints = {
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'environment' // 'user' para frontal, 'environment' para trasera
        },
        audio: false
      };

      // Solicitar acceso a la cámara
      this.mediaStream = await navigator.mediaDevices.getUserMedia(constraints);

      // Asignar el stream al elemento video
      this.videoElement.nativeElement.srcObject = this.mediaStream;
      this.isStreaming.set(true);

    } catch (error) {
      console.error('Error accessing camera:', error);
      this.handleCameraError(error);
    }
  }

  stopCamera(): void {
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop());
      this.mediaStream = null;
    }
    this.isStreaming.set(false);
  }

  takePhoto(): void {
    if (!this.isStreaming()) return;

    const video = this.videoElement.nativeElement;
    const canvas = this.canvasElement.nativeElement;
    const context = canvas.getContext('2d');

    if (!context) {
      this.errorMessage.set('Error al acceder al canvas');
      return;
    }

    // Configurar el canvas con las dimensiones del video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Dibujar el frame actual del video en el canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convertir a base64
    const photoDataUrl = canvas.toDataURL('image/jpeg', 0.9);
    this.capturedPhoto.set(photoDataUrl);
  }

  processPhotos(): void {
    console.log('Procesando fotos...');
  }

  getPhotoSize(): string {
    const photo = this.capturedPhoto();
    if (!photo) return '0 KB';

    // Calcular tamaño aproximado del base64
    const sizeInBytes = (photo.length * 3) / 4;
    const sizeInMB = sizeInBytes / (1024 * 1024);

    if (sizeInMB > 1) {
      return `${sizeInMB.toFixed(1)} MB`;
    } else {
      const sizeInKB = sizeInBytes / 1024;
      return `${sizeInKB.toFixed(0)} KB`;
    }
  }

  clearPhoto(): void {
    this.capturedPhoto.set(null);
  }

  private handleCameraError(error: any): void {
    let message = 'Error desconocido al acceder a la cámara';

    if (error.name === 'NotAllowedError') {
      message = 'Permiso de cámara denegado. Por favor, permite el acceso a la cámara.';
    } else if (error.name === 'NotFoundError') {
      message = 'No se encontró ninguna cámara en el dispositivo.';
    } else if (error.name === 'NotSupportedError') {
      message = 'La cámara no es compatible con este navegador.';
    } else if (error.name === 'NotReadableError') {
      message = 'La cámara está siendo utilizada por otra aplicación.';
    }

    this.errorMessage.set(message);
  }

  ngOnDestroy(): void {
    this.stopCamera();
  }
}
