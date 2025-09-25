import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <div class="dashboard-header">
      <h1>My Projects</h1>
      <button mat-raised-button color="primary" (click)="createProject()">
        <mat-icon>add</mat-icon>
        New Project
      </button>
    </div>

    <div class="dashboard-content">
      <div class="empty-state">
        <mat-icon class="empty-icon">folder_open</mat-icon>
        <h2>No projects yet</h2>
        <p>Create your first project to get started with NotebookLM</p>
        <button mat-raised-button color="primary" (click)="createProject()">
          <mat-icon>add</mat-icon>
          Create Project
        </button>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }

    .dashboard-content {
      min-height: 400px;
    }

    .empty-state {
      text-align: center;
      padding: 48px;
    }

    .empty-icon {
      font-size: 64px;
      height: 64px;
      width: 64px;
      color: #ccc;
      margin-bottom: 16px;
    }

    .empty-state h2 {
      margin: 16px 0;
      color: #666;
    }

    .empty-state p {
      color: #999;
      margin-bottom: 24px;
    }
  `]
})
export class DashboardComponent {
  constructor(private router: Router) {}

  createProject() {
    console.log('Create project clicked');
  }
}