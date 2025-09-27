using System.ComponentModel.DataAnnotations;

namespace NotebookLM.API.Models;

public class SignUpRequest
{
    [Required]
    [StringLength(50, MinimumLength = 3)]
    public string Username { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required]
    [StringLength(100, MinimumLength = 6)]
    public string Password { get; set; } = string.Empty;

    [StringLength(50)]
    public string FirstName { get; set; } = string.Empty;

    [StringLength(50)]
    public string LastName { get; set; } = string.Empty;
}

public class SignUpResponse
{
    public string Message { get; set; } = string.Empty;
    public string UserId { get; set; } = string.Empty;
    public bool Success { get; set; }
}