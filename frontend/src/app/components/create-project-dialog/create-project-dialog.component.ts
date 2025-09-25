import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ProjectService } from '../../services/project.service';
import { CreateProjectRequest } from '../../models/project.model';

@Component({
  selector: 'app-create-project-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  template: `
    <h1 mat-dialog-title>Create New Project</h1>
    <div mat-dialog-content>
      <mat-form-field class="full-width">
        <mat-label>Project Name</mat-label>
        <input matInput [(ngModel)]="projectData.name" placeholder="Enter project name" required>
      </mat-form-field>

      <mat-form-field class="full-width">
        <mat-label>Description</mat-label>
        <textarea matInput [(ngModel)]="projectData.description" placeholder="Enter project description" rows="3"></textarea>
      </mat-form-field>
    </div>
    <div mat-dialog-actions>
      <button mat-button (click)="cancel()">Cancel</button>
      <button mat-raised-button color="primary" (click)="create()" [disabled]="!projectData.name">Create</button>
    </div>
  `,
  styles: [`
    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }
  `]
})
export class CreateProjectDialogComponent {
  projectData: CreateProjectRequest = {
    name: '',
    description: ''
  };

  constructor(
    private dialogRef: MatDialogRef<CreateProjectDialogComponent>,
    private projectService: ProjectService
  ) {}

  cancel() {
    this.dialogRef.close();
  }

  async create() {
    if (!this.projectData.name) return;

    try {
      const project$ = await this.projectService.createProject(this.projectData);
      project$.subscribe({
        next: (project) => {
          this.dialogRef.close(project);
        },
        error: (error) => {
          console.error('Error creating project:', error);
        }
      });
    } catch (error) {
      console.error('Error creating project:', error);
    }
  }
}