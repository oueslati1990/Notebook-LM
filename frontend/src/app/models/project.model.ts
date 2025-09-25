export interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  fileCount: number;
  summaryCount: number;
}

export interface ProjectDetails extends Project {
  files: ProjectFile[];
  summaries: ProjectSummary[];
}

export interface ProjectFile {
  id: string;
  fileName: string;
  contentType: string;
  fileSize: number;
  uploadedAt: string;
}

export interface ProjectSummary {
  id: string;
  title: string;
  content: string;
  generatedAt: string;
}

export interface CreateProjectRequest {
  name: string;
  description?: string;
}

export interface UpdateProjectRequest {
  name: string;
  description?: string;
}