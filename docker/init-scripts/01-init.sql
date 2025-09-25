-- Enable PgVector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Create Keycloak database
CREATE DATABASE keycloak;

-- Create additional databases if needed
-- The main application will use the 'notebooklm' database specified in docker-compose.yml