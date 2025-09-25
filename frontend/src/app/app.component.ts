import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <mat-toolbar color="primary">
      <mat-icon class="mr-2">menu_book</mat-icon>
      <span>NotebookLM</span>
      <span class="spacer"></span>
      <button mat-button>
        <mat-icon>login</mat-icon>
        Login
      </button>
    </mat-toolbar>

    <main class="container">
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [`
    .spacer {
      flex: 1 1 auto;
    }
    .container {
      padding: 24px;
    }
    .mr-2 {
      margin-right: 8px;
    }
  `]
})
export class AppComponent {
  title = 'NotebookLM';
}