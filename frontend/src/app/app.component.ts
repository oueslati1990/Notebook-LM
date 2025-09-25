import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { KeycloakService } from 'keycloak-angular';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule
  ],
  template: `
    <mat-toolbar color="primary">
      <mat-icon class="mr-2">menu_book</mat-icon>
      <span>NotebookLM</span>
      <span class="spacer"></span>

      <div *ngIf="isAuthenticated; else loginButton">
        <button mat-button [matMenuTriggerFor]="userMenu">
          <mat-icon>account_circle</mat-icon>
          {{ username }}
        </button>
        <mat-menu #userMenu="matMenu">
          <button mat-menu-item (click)="logout()">
            <mat-icon>logout</mat-icon>
            <span>Logout</span>
          </button>
        </mat-menu>
      </div>

      <ng-template #loginButton>
        <button mat-button (click)="login()">
          <mat-icon>login</mat-icon>
          Login
        </button>
      </ng-template>
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
export class AppComponent implements OnInit {
  isAuthenticated = false;
  username = '';

  constructor(
    private keycloakService: KeycloakService,
    private router: Router
  ) {}

  async ngOnInit() {
    this.isAuthenticated = await this.keycloakService.isLoggedIn();
    if (this.isAuthenticated) {
      const profile = await this.keycloakService.loadUserProfile();
      this.username = profile.username || profile.email || 'User';
    }
  }

  login() {
    this.keycloakService.login();
  }

  logout() {
    this.keycloakService.logout();
  }
}