using Pgvector;

namespace NotebookLM.Domain.Entities;

public class DocumentChunk
{
    public Guid Id { get; set; }
    public string Content { get; set; } = string.Empty;
    public Vector Embedding { get; set; } = new Vector(Array.Empty<float>());
    public int ChunkIndex { get; set; }
    public Guid DocumentFileId { get; set; }
    public DateTime CreatedAt { get; set; }

    public DocumentFile DocumentFile { get; set; } = null!;
}