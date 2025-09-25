# NotebookLM

A NotebookLM-like application for creating summaries from uploaded documents using RAG (Retrieval-Augmented Generation).

## Features

- **Project Management**: Create and manage document projects
- **File Upload**: Support for PDF, TXT, and DOCX files
- **AI Summarization**: Generate intelligent summaries using OpenAI
- **Vector Search**: Efficient document chunking and embedding with Cohere
- **Authentication**: Secure user authentication with Keycloak
- **Modern UI**: Responsive React frontend with Tailwind CSS

## Tech Stack

### Backend (.NET 8)
- **Architecture**: Clean Architecture pattern
- **Database**: PostgreSQL with PgVector extension
- **Authentication**: Keycloak integration
- **AI Services**: OpenAI for text generation, Cohere for embeddings

### Frontend (React + TypeScript)
- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS
- **State Management**: TanStack Query
- **Routing**: React Router
- **Authentication**: Keycloak JS

### DevOps
- **Containerization**: Docker Compose
- **Database**: PostgreSQL with PgVector
- **Authentication**: Keycloak

## Quick Start

### Prerequisites
- Docker and Docker Compose
- .NET 8 SDK (for local development)
- Node.js 18+ (for local development)

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Notebook-LM
   ```

2. **Environment Configuration**
   ```bash
   cp .env.example .env
   # Edit .env with your OpenAI API key and other configuration
   ```

3. **Start with Docker Compose**
   ```bash
   docker-compose up -d
   ```

   This will start:
   - PostgreSQL with PgVector (port 5432)
   - Keycloak (port 8080)
   - Backend API (port 5000)
   - Frontend (port 3000)

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - Keycloak Admin: http://localhost:8080 (admin/admin)

### Local Development

#### Backend
```bash
cd backend
dotnet restore
dotnet run --project src/NotebookLM.API
```

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Project Structure

```
├── backend/                 # .NET Core backend
│   ├── src/
│   │   ├── NotebookLM.API/          # Web API layer
│   │   ├── NotebookLM.Application/  # Application layer
│   │   ├── NotebookLM.Domain/       # Domain layer
│   │   └── NotebookLM.Infrastructure/ # Infrastructure layer
│   └── Dockerfile
├── frontend/                # React frontend
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   └── types/          # TypeScript types
│   └── Dockerfile
├── docker/                 # Docker configuration
│   └── init-scripts/       # Database initialization
├── docker-compose.yml      # Container orchestration
└── .env.example           # Environment variables template
```

## Environment Variables

Create a `.env` file with the following variables:

```env
# OpenAI API Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=notebooklm
DB_USER=postgres
DB_PASSWORD=postgres

# Keycloak Configuration
KEYCLOAK_URL=http://localhost:8080
KEYCLOAK_REALM=notebooklm
KEYCLOAK_CLIENT_ID=notebooklm-client

# API Configuration
API_URL=http://localhost:5000
FRONTEND_URL=http://localhost:3000
```

## Development Workflow

1. **Database Migrations** (when schema changes)
   ```bash
   cd backend
   dotnet ef migrations add MigrationName --project src/NotebookLM.Infrastructure --startup-project src/NotebookLM.API
   dotnet ef database update --project src/NotebookLM.Infrastructure --startup-project src/NotebookLM.API
   ```

2. **Running Tests**
   ```bash
   # Backend tests
   cd backend && dotnet test

   # Frontend tests
   cd frontend && npm test
   ```

3. **Building for Production**
   ```bash
   # Build all services
   docker-compose -f docker-compose.yml build

   # Or build individually
   cd backend && dotnet build --configuration Release
   cd frontend && npm run build
   ```

## API Documentation

Once the backend is running, visit:
- Swagger UI: http://localhost:5000/swagger

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
