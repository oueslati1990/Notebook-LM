import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Project, ProjectDetails, CreateProjectRequest, UpdateProjectRequest } from '../models/project.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private apiUrl = `${environment.apiUrl}/api/projects`;

  constructor(private http: HttpClient) {}

  /**
   * Get all projects for the current user
   */
  getProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(this.apiUrl);
  }

  /**
   * Get a specific project by ID with details
   */
  getProject(id: string): Observable<ProjectDetails> {
    return this.http.get<ProjectDetails>(`${this.apiUrl}/${id}`);
  }

  /**
   * Create a new project
   */
  createProject(projectData: CreateProjectRequest): Observable<Project> {
    return this.http.post<Project>(this.apiUrl, projectData);
  }

  /**
   * Update an existing project
   */
  updateProject(id: string, projectData: UpdateProjectRequest): Observable<Project> {
    return this.http.put<Project>(`${this.apiUrl}/${id}`, projectData);
  }

  /**
   * Delete a project
   */
  deleteProject(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  /**
   * Get project statistics
   */
  getProjectStats(): Observable<{ totalProjects: number; totalFiles: number; totalSummaries: number }> {
    return this.http.get<{ totalProjects: number; totalFiles: number; totalSummaries: number }>(`${this.apiUrl}/stats`);
  }
}