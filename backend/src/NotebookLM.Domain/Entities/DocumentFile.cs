namespace NotebookLM.Domain.Entities;

public class DocumentFile
{
    public Guid Id { get; set; }
    public string FileName { get; set; } = string.Empty;
    public string ContentType { get; set; } = string.Empty;
    public long FileSize { get; set; }
    public string FilePath { get; set; } = string.Empty;
    public Guid ProjectId { get; set; }
    public DateTime UploadedAt { get; set; }

    public Project Project { get; set; } = null!;
    public ICollection<DocumentChunk> Chunks { get; set; } = new List<DocumentChunk>();
}