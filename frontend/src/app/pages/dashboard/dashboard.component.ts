import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { KeycloakService } from 'keycloak-angular';
import { AuthService } from '../../services/auth.service';

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
      <div class="header-buttons">
        <button mat-button color="accent" (click)="testApiConnection()" class="mr-2">
          <mat-icon>wifi</mat-icon>
          Test API
        </button>
        <button mat-raised-button color="primary" (click)="createProject()">
          <mat-icon>add</mat-icon>
          New Project
        </button>
      </div>
    </div>

    <div class="dashboard-content">
      <div class="auth-info" *ngIf="userInfo">
        <mat-card class="mb-3">
          <mat-card-header>
            <mat-card-title>Authentication Status</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <p><strong>Welcome:</strong> {{ userInfo.name || userInfo.email || 'User' }}</p>
            <p><strong>Email:</strong> {{ userInfo.email || 'N/A' }}</p>
            <p><strong>User ID:</strong> {{ userInfo.userId || 'N/A' }}</p>
            <button mat-stroked-button (click)="testProtectedEndpoint()">
              <mat-icon>security</mat-icon>
              Test Protected Endpoint
            </button>
          </mat-card-content>
        </mat-card>
      </div>

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

    .header-buttons {
      display: flex;
      gap: 8px;
    }

    .dashboard-content {
      min-height: 400px;
    }

    .auth-info {
      margin-bottom: 24px;
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

    .mb-3 {
      margin-bottom: 24px;
    }

    .mr-2 {
      margin-right: 8px;
    }
  `]
})
export class DashboardComponent implements OnInit {
  userInfo: any = null;

  constructor(
    private router: Router,
    private keycloakService: KeycloakService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  async ngOnInit() {
    await this.loadUserInfo();
  }

  async loadUserInfo() {
    try {
      const currentUser$ = await this.authService.getCurrentUser();
      currentUser$.subscribe({
        next: (data) => {
          this.userInfo = data;
        },
        error: (error) => {
          console.error('Error loading user info:', error);
          this.snackBar.open('Error loading user information', 'Close', { duration: 3000 });
        }
      });
    } catch (error) {
      console.error('Error getting user info:', error);
    }
  }

  async testApiConnection() {
    try {
      const test$ = await this.authService.testApi();
      test$.subscribe({
        next: (data) => {
          this.snackBar.open('API connection successful!', 'Close', { duration: 3000 });
          console.log('API test response:', data);
        },
        error: (error) => {
          this.snackBar.open('API connection failed', 'Close', { duration: 3000 });
          console.error('API test error:', error);
        }
      });
    } catch (error) {
      this.snackBar.open('Error testing API', 'Close', { duration: 3000 });
      console.error('Error testing API:', error);
    }
  }

  async testProtectedEndpoint() {
    try {
      const protected$ = await this.authService.testProtectedEndpoint();
      protected$.subscribe({
        next: (data) => {
          this.snackBar.open('Protected endpoint access successful!', 'Close', { duration: 3000 });
          console.log('Protected endpoint response:', data);
        },
        error: (error) => {
          this.snackBar.open('Protected endpoint access failed', 'Close', { duration: 3000 });
          console.error('Protected endpoint error:', error);
        }
      });
    } catch (error) {
      this.snackBar.open('Error accessing protected endpoint', 'Close', { duration: 3000 });
      console.error('Error accessing protected endpoint:', error);
    }
  }

  createProject() {
    console.log('Create project clicked');
    this.snackBar.open('Project creation will be implemented next!', 'Close', { duration: 3000 });
  }
}