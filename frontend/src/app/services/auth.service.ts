import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { KeycloakService } from 'keycloak-angular';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.api.baseUrl;

  constructor(
    private http: HttpClient,
    private keycloakService: KeycloakService
  ) {}

  private async getAuthHeaders(): Promise<HttpHeaders> {
    const token = await this.keycloakService.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  async testApi(): Promise<Observable<any>> {
    return this.http.get(`${this.apiUrl}/auth/test`);
  }

  async getCurrentUser(): Promise<Observable<any>> {
    const headers = await this.getAuthHeaders();
    return this.http.get(`${this.apiUrl}/auth/me`, { headers });
  }

  async testProtectedEndpoint(): Promise<Observable<any>> {
    const headers = await this.getAuthHeaders();
    return this.http.get(`${this.apiUrl}/auth/protected`, { headers });
  }
}