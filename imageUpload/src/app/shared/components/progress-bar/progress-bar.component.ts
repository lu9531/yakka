import { CommonModule } from '@angular/common';
import { Component, inject, input } from '@angular/core';

import { ProgressBarService } from '../../services/progress-bar.service';

@Component({
  selector: 'app-progress-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './progress-bar.component.html',
  styleUrl: './progress-bar.component.scss'
})
export class ProgressBarComponent {

  private readonly _progressBarService = inject(ProgressBarService);

  totalProgress = input<number>(0);

}
