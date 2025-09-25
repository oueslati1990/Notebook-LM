namespace NotebookLM.Domain.Entities;

public class Summary
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public Guid ProjectId { get; set; }
    public DateTime GeneratedAt { get; set; }

    public Project Project { get; set; } = null!;
}