import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./features/imageupload/imageupload.component').then(c => c.ImageuploadComponent)
    }
];
