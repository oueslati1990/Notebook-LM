import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { AuthService } from '../../services/auth.service';
import { ProjectService } from '../../services/project.service';
import { CreateProjectDialogComponent } from '../../components/create-project-dialog/create-project-dialog.component';
import { Project } from '../../models/project.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatMenuModule,
    MatDividerModule,
    MatChipsModule
  ],
  template: `
    <!-- Simple Header -->
    <div class="notebooklm-header">
      <div class="header-left">
        <div class="logo-section">
          <mat-icon class="wifi-icon">wifi</mat-icon>
          <span class="logo-text">NotebookLM</span>
        </div>
      </div>

      <div class="header-right">
        <button mat-icon-button class="settings-btn">
          <mat-icon>settings</mat-icon>
        </button>
        <button mat-icon-button [matMenuTriggerFor]="userMenu" class="menu-btn">
          <mat-icon>apps</mat-icon>
        </button>
        <mat-menu #userMenu="matMenu">
          <button mat-menu-item (click)="testApiConnection()">
            <mat-icon>wifi</mat-icon>
            Test API Connection
          </button>
          <button mat-menu-item (click)="logout()">
            <mat-icon>logout</mat-icon>
            Sign Out
          </button>
        </mat-menu>
      </div>
    </div>

    <!-- Navigation Tabs -->
    <div class="nav-tabs">
      <div class="tabs-left">
        <button class="tab-btn active">Tous</button>
        <button class="tab-btn">Mes notebooks</button>
        <button class="tab-btn">Sélection de notebooks</button>
      </div>

      <div class="tabs-right">
        <div class="view-controls">
          <button mat-icon-button class="view-btn" [class.active]="viewMode === 'grid'" (click)="setViewMode('grid')">
            <mat-icon>grid_view</mat-icon>
          </button>
          <button mat-icon-button class="view-btn" [class.active]="viewMode === 'list'" (click)="setViewMode('list')">
            <mat-icon>view_list</mat-icon>
          </button>
        </div>

        <button mat-button class="sort-btn" [matMenuTriggerFor]="sortMenu">
          Les plus récents
          <mat-icon>keyboard_arrow_down</mat-icon>
        </button>
        <mat-menu #sortMenu="matMenu">
          <button mat-menu-item>Les plus récents</button>
          <button mat-menu-item>Les plus anciens</button>
          <button mat-menu-item>Nom (A-Z)</button>
          <button mat-menu-item>Nom (Z-A)</button>
        </mat-menu>

        <button mat-raised-button class="create-btn" (click)="createProject()">
          <mat-icon>add</mat-icon>
          Créer
        </button>
      </div>
    </div>

    <!-- Main Content -->
    <div class="main-content">
      <div class="section-title">Notebooks récents</div>

      <!-- Notebooks Grid -->
      <div class="notebooks-grid" [class.list-view]="viewMode === 'list'">
        <!-- Create New Notebook Card -->
        <div class="notebook-card create-card" (click)="createProject()">
          <div class="card-content">
            <div class="create-icon">
              <mat-icon>add</mat-icon>
            </div>
            <div class="card-title">Créer un notebook</div>
          </div>
        </div>

        <!-- Project Cards -->
        <div
          class="notebook-card"
          *ngFor="let project of projects; trackBy: trackByProjectId"
          (click)="openProject(project.id)">

          <button
            mat-icon-button
            class="card-menu-btn"
            [matMenuTriggerFor]="cardMenu"
            (click)="$event.stopPropagation()">
            <mat-icon>more_vert</mat-icon>
          </button>
          <mat-menu #cardMenu="matMenu">
            <button mat-menu-item (click)="editProject(project)">
              <mat-icon>edit</mat-icon>
              Modifier
            </button>
            <button mat-menu-item (click)="deleteProject(project)">
              <mat-icon>delete</mat-icon>
              Supprimer
            </button>
          </mat-menu>

          <div class="card-content">
            <div class="card-icon">
              <img [src]="getProjectIcon(project)" [alt]="project.name" />
            </div>
            <div class="card-title">{{ project.name }}</div>
            <div class="card-meta">
              {{ formatDate(project.updatedAt) }} • {{ project.fileCount }} source{{ project.fileCount > 1 ? 's' : '' }}
            </div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div class="loading-state" *ngIf="isLoading">
        <mat-icon class="loading-icon">refresh</mat-icon>
        <span>Chargement...</span>
      </div>

      <!-- Empty State (when no projects) -->
      <div class="empty-notebooks" *ngIf="!isLoading && projects.length === 0">
        <div class="empty-content">
          <mat-icon class="empty-icon">auto_stories</mat-icon>
          <h3>Aucun notebook trouvé</h3>
          <p>Créez votre premier notebook pour commencer</p>
          <button mat-raised-button class="create-btn" (click)="createProject()">
            <mat-icon>add</mat-icon>
            Créer un notebook
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    /* Reset and Base Styles */
    :host {
      display: block;
      background: #f8f9fa;
      min-height: 100vh;
      font-family: 'Google Sans', Roboto, sans-serif;
    }

    /* Header Styles */
    .notebooklm-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 24px;
      background: white;
      border-bottom: 1px solid #e8eaed;
    }

    .header-left {
      display: flex;
      align-items: center;
    }

    .logo-section {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .wifi-icon {
      font-size: 20px;
      color: #1a73e8;
    }

    .logo-text {
      font-size: 20px;
      font-weight: 400;
      color: #202124;
      letter-spacing: -0.5px;
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .settings-btn, .menu-btn {
      color: #5f6368;
    }

    /* Navigation Tabs */
    .nav-tabs {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 24px;
      background: white;
      border-bottom: 1px solid #e8eaed;
      min-height: 60px;
    }

    .tabs-left {
      display: flex;
      gap: 0;
    }

    .tab-btn {
      background: none;
      border: none;
      padding: 12px 16px;
      color: #5f6368;
      font-size: 14px;
      cursor: pointer;
      border-bottom: 3px solid transparent;
      transition: all 0.2s ease;
    }

    .tab-btn.active {
      color: #1a73e8;
      border-bottom-color: #1a73e8;
      font-weight: 500;
    }

    .tab-btn:hover {
      background: #f1f3f4;
    }

    .tabs-right {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .view-controls {
      display: flex;
      align-items: center;
      border: 1px solid #dadce0;
      border-radius: 8px;
      overflow: hidden;
    }

    .view-btn {
      width: 40px;
      height: 40px;
      border: none;
      background: white;
      color: #5f6368;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .view-btn.active {
      background: #e8f0fe;
      color: #1a73e8;
    }

    .view-btn:not(:last-child) {
      border-right: 1px solid #dadce0;
    }

    .sort-btn {
      color: #5f6368;
      font-size: 14px;
      padding: 8px 12px;
    }

    .create-btn {
      background: #1a73e8 !important;
      color: white !important;
      border-radius: 20px;
      padding: 8px 16px;
      font-size: 14px;
      font-weight: 500;
      text-transform: none;
      box-shadow: none;
    }

    .create-btn:hover {
      background: #1765cc !important;
      box-shadow: 0 2px 4px rgba(26, 115, 232, 0.3);
    }

    /* Main Content */
    .main-content {
      padding: 24px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .section-title {
      font-size: 22px;
      font-weight: 400;
      color: #202124;
      margin-bottom: 24px;
    }

    /* Notebooks Grid */
    .notebooks-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 24px;
    }

    .notebooks-grid.list-view {
      grid-template-columns: 1fr;
      gap: 12px;
    }

    /* Notebook Cards */
    .notebook-card {
      background: white;
      border: 1px solid #e8eaed;
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.2s ease;
      position: relative;
      aspect-ratio: 1;
      padding: 24px;
      display: flex;
      flex-direction: column;
    }

    .notebook-card:hover {
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      border-color: #dadce0;
    }

    .notebooks-grid.list-view .notebook-card {
      aspect-ratio: unset;
      padding: 16px 24px;
      flex-direction: row;
      align-items: center;
    }

    /* Create Card Specific */
    .create-card {
      border: 2px dashed #dadce0;
      background: #fafbfc;
    }

    .create-card:hover {
      border-color: #1a73e8;
      background: #f8f9fa;
    }

    .create-card .card-content {
      justify-content: center;
      align-items: center;
      text-align: center;
    }

    .create-icon {
      width: 80px;
      height: 80px;
      background: #e8f0fe;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 16px;
    }

    .create-icon mat-icon {
      font-size: 32px;
      color: #1a73e8;
    }

    /* Card Content */
    .card-content {
      display: flex;
      flex-direction: column;
      flex: 1;
      justify-content: center;
    }

    .card-icon {
      display: flex;
      justify-content: center;
      margin-bottom: 16px;
    }

    .card-icon img {
      width: 80px;
      height: 80px;
      object-fit: cover;
      border-radius: 8px;
    }

    .card-title {
      font-size: 16px;
      font-weight: 500;
      color: #202124;
      margin-bottom: 8px;
      text-align: center;
      line-height: 1.3;
    }

    .card-meta {
      font-size: 13px;
      color: #5f6368;
      text-align: center;
    }

    /* List View Adjustments */
    .notebooks-grid.list-view .card-content {
      flex-direction: row;
      align-items: center;
      text-align: left;
    }

    .notebooks-grid.list-view .card-icon {
      margin-bottom: 0;
      margin-right: 16px;
    }

    .notebooks-grid.list-view .card-icon img {
      width: 48px;
      height: 48px;
    }

    .notebooks-grid.list-view .card-title {
      text-align: left;
      margin-bottom: 4px;
    }

    .notebooks-grid.list-view .card-meta {
      text-align: left;
    }

    /* Card Menu */
    .card-menu-btn {
      position: absolute;
      top: 8px;
      right: 8px;
      color: #5f6368;
      opacity: 0;
      transition: opacity 0.2s ease;
    }

    .notebook-card:hover .card-menu-btn {
      opacity: 1;
    }

    /* Loading State */
    .loading-state {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      padding: 40px;
      color: #5f6368;
    }

    .loading-icon {
      animation: spin 1s linear infinite;
    }

    /* Empty State */
    .empty-notebooks {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 300px;
      text-align: center;
    }

    .empty-content {
      max-width: 400px;
    }

    .empty-icon {
      font-size: 64px;
      color: #dadce0;
      margin-bottom: 16px;
    }

    .empty-content h3 {
      font-size: 20px;
      font-weight: 400;
      color: #202124;
      margin: 0 0 8px 0;
    }

    .empty-content p {
      color: #5f6368;
      margin: 0 0 24px 0;
    }

    /* Animations */
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .notebooklm-header {
        padding: 12px 16px;
      }

      .nav-tabs {
        padding: 0 16px;
        flex-direction: column;
        gap: 12px;
        min-height: auto;
        padding-top: 12px;
        padding-bottom: 12px;
      }

      .tabs-right {
        justify-content: center;
        gap: 12px;
      }

      .main-content {
        padding: 16px;
      }

      .notebooks-grid {
        grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
        gap: 16px;
      }

      .section-title {
        font-size: 20px;
        margin-bottom: 16px;
      }
    }

    @media (max-width: 480px) {
      .notebooks-grid {
        grid-template-columns: 1fr;
      }

      .tabs-left {
        flex-wrap: wrap;
      }

      .tab-btn {
        padding: 8px 12px;
        font-size: 13px;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  userInfo: any = null;
  projects: Project[] = [];
  isLoading = false;
  viewMode: 'grid' | 'list' = 'grid';

  constructor(
    private router: Router,
    private authService: AuthService,
    private projectService: ProjectService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadUserInfo();
    this.loadProjects();
  }

  loadUserInfo() {
    this.authService.getCurrentUser().subscribe({
      next: (data) => {
        this.userInfo = data;
      },
      error: (error) => {
        console.error('Error loading user info:', error);
        this.snackBar.open('Error loading user information', 'Close', { duration: 3000 });
      }
    });
  }

  loadProjects() {
    this.isLoading = true;
    this.projectService.getProjects().subscribe({
      next: (projects) => {
        this.projects = projects;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading projects:', error);
        this.snackBar.open('Error loading projects', 'Close', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }

  createProject() {
    const dialogRef = this.dialog.open(CreateProjectDialogComponent, {
      width: '500px',
      maxWidth: '90vw'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.snackBar.open('Project created successfully!', 'Close', { duration: 3000 });
        this.loadProjects(); // Refresh the projects list
      }
    });
  }

  openProject(projectId: string) {
    this.router.navigate(['/project', projectId]);
  }

  editProject(project: Project) {
    // TODO: Implement edit project dialog
    console.log('Edit project:', project);
    this.snackBar.open('Edit project functionality coming soon!', 'Close', { duration: 3000 });
  }

  deleteProject(project: Project) {
    // TODO: Implement delete confirmation dialog
    if (confirm(`Are you sure you want to delete "${project.name}"?`)) {
      this.projectService.deleteProject(project.id).subscribe({
        next: () => {
          this.snackBar.open('Project deleted successfully', 'Close', { duration: 3000 });
          this.loadProjects(); // Refresh the projects list
        },
        error: (error) => {
          console.error('Error deleting project:', error);
          this.snackBar.open('Error deleting project', 'Close', { duration: 3000 });
        }
      });
    }
  }

  testApiConnection() {
    this.authService.testProtectedEndpoint().subscribe({
      next: (data) => {
        this.snackBar.open('API connection successful!', 'Close', { duration: 3000 });
        console.log('API test response:', data);
      },
      error: (error) => {
        this.snackBar.open('API connection failed', 'Close', { duration: 3000 });
        console.error('API test error:', error);
      }
    });
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Logout error:', error);
        this.router.navigate(['/login']); // Navigate anyway
      }
    });
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) {
      return 'today';
    } else if (diffInDays === 1) {
      return 'yesterday';
    } else if (diffInDays < 7) {
      return `${diffInDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  }

  setViewMode(mode: 'grid' | 'list') {
    this.viewMode = mode;
  }

  getProjectIcon(project: Project): string {
    // Return a placeholder icon for now - this would be enhanced with actual project icons
    const icons = [
      'https://via.placeholder.com/80x80/1a73e8/ffffff?text=📚',
      'https://via.placeholder.com/80x80/34a853/ffffff?text=📄',
      'https://via.placeholder.com/80x80/ea4335/ffffff?text=🔬',
      'https://via.placeholder.com/80x80/fbbc04/ffffff?text=💡',
      'https://via.placeholder.com/80x80/9c27b0/ffffff?text=📊'
    ];

    // Use project id hash to consistently assign the same icon to the same project
    const hash = project.id.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);

    return icons[Math.abs(hash) % icons.length];
  }

  trackByProjectId(_index: number, project: Project): string {
    return project.id;
  }
}