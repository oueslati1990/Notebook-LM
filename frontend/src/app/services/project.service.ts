import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { KeycloakService } from 'keycloak-angular';
import { Project, ProjectDetails, CreateProjectRequest, UpdateProjectRequest } from '../models/project.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private apiUrl = `${environment.apiUrl}/api/projects`;

  constructor(
    private http: HttpClient,
    private keycloakService: KeycloakService
  ) {}

  private async getHeaders(): Promise<HttpHeaders> {
    const token = await this.keycloakService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  async getProjects(): Promise<Observable<Project[]>> {
    const headers = await this.getHeaders();
    return this.http.get<Project[]>(this.apiUrl, { headers });
  }

  async getProject(id: string): Promise<Observable<ProjectDetails>> {
    const headers = await this.getHeaders();
    return this.http.get<ProjectDetails>(`${this.apiUrl}/${id}`, { headers });
  }

  async createProject(project: CreateProjectRequest): Promise<Observable<Project>> {
    const headers = await this.getHeaders();
    return this.http.post<Project>(this.apiUrl, project, { headers });
  }

  async updateProject(id: string, project: UpdateProjectRequest): Promise<Observable<void>> {
    const headers = await this.getHeaders();
    return this.http.put<void>(`${this.apiUrl}/${id}`, project, { headers });
  }

  async deleteProject(id: string): Promise<Observable<void>> {
    const headers = await this.getHeaders();
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers });
  }
}