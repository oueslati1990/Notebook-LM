using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace NotebookLM.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    [HttpGet("test")]
    [AllowAnonymous]
    public IActionResult TestEndpoint()
    {
        return Ok(new { message = "API is working", timestamp = DateTime.UtcNow });
    }

    [HttpGet("me")]
    [Authorize]
    public IActionResult GetCurrentUser()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ??
                    User.FindFirst("sub")?.Value;
        var email = User.FindFirst(ClaimTypes.Email)?.Value ??
                   User.FindFirst("email")?.Value;
        var name = User.FindFirst(ClaimTypes.Name)?.Value ??
                  User.FindFirst("preferred_username")?.Value ??
                  User.FindFirst("name")?.Value;

        return Ok(new
        {
            userId,
            email,
            name,
            claims = User.Claims.Select(c => new { c.Type, c.Value }).ToList()
        });
    }

    [HttpGet("protected")]
    [Authorize]
    public IActionResult ProtectedEndpoint()
    {
        return Ok(new
        {
            message = "This is a protected endpoint",
            user = User.Identity?.Name ?? "Unknown",
            timestamp = DateTime.UtcNow
        });
    }
}