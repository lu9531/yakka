import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./features/imageupload/imageupload.component').then(c => c.ImageuploadComponent)
    },
        {
        path: 'upload',
        loadComponent: () => import('./features/imageupload/imageupload.component').then(c => c.ImageuploadComponent)
    },
    {
        path: 'capture',
        loadComponent: () => import('./features/camera-capture/camera-capture.component').then(c => c.CameraCaptureComponent)
    }

];
