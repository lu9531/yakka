import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-menu',
  imports: [RouterModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent implements OnInit {

  theme: string = 'light';

  ngOnInit(): void {
    this.theme = localStorage.getItem('theme') ?? 'light';
    document.documentElement.setAttribute('data-theme', this.theme);
  }

  setTheme() {
    const theme = this.theme === 'light' ? 'dark' : 'light';
    this.theme = theme;
    localStorage.setItem('theme', this.theme)
    document.documentElement.setAttribute('data-theme', this.theme);
  }

}
