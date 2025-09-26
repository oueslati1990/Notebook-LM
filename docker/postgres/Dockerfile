FROM pgvector/pgvector:pg16

# Copy init scripts with proper ownership
COPY --chown=postgres:postgres init-scripts/ /docker-entrypoint-initdb.d/

# Ensure proper permissions
USER root
RUN chmod 755 /docker-entrypoint-initdb.d/ && \
    chmod 644 /docker-entrypoint-initdb.d/*

USER postgres