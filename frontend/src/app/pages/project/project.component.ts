import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-project',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <div class="project-header">
      <button mat-icon-button (click)="goBack()">
        <mat-icon>arrow_back</mat-icon>
      </button>
      <h1>Project Details</h1>
    </div>

    <div class="project-content">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Project #{{ projectId }}</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <p>This is a placeholder for the project page.</p>
          <p>Project features will be implemented after authentication is complete.</p>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .project-header {
      display: flex;
      align-items: center;
      margin-bottom: 24px;
    }

    .project-header h1 {
      margin: 0 0 0 16px;
    }

    .project-content {
      max-width: 800px;
    }
  `]
})
export class ProjectComponent implements OnInit {
  projectId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.projectId = this.route.snapshot.paramMap.get('id');
  }

  goBack() {
    this.router.navigate(['/']);
  }
}