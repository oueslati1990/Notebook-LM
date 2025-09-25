namespace NotebookLM.Domain.Entities;

public class Project
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public Guid UserId { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    public User User { get; set; } = null!;
    public ICollection<DocumentFile> Files { get; set; } = new List<DocumentFile>();
    public ICollection<Summary> Summaries { get; set; } = new List<Summary>();
}