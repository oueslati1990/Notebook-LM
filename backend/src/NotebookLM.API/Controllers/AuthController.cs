using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NotebookLM.API.Models;
using NotebookLM.API.Services;
using System.Security.Claims;

namespace NotebookLM.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IKeycloakService _keycloakService;

    public AuthController(IKeycloakService keycloakService)
    {
        _keycloakService = keycloakService;
    }
    [HttpGet("test")]
    [AllowAnonymous]
    public IActionResult TestEndpoint()
    {
        return Ok(new { message = "API is working", timestamp = DateTime.UtcNow });
    }

    [HttpPost("login")]
    [AllowAnonymous]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        if (string.IsNullOrEmpty(request.Username) || string.IsNullOrEmpty(request.Password))
        {
            return BadRequest(new { error = "Username and password are required" });
        }

        var tokenResponse = await _keycloakService.LoginAsync(request.Username, request.Password);

        if (tokenResponse == null)
        {
            return Unauthorized(new { error = "Invalid credentials" });
        }

        // Set refresh token as HTTPOnly cookie
        var cookieOptions = new CookieOptions
        {
            HttpOnly = true,
            Secure = Request.IsHttps, // Use HTTPS in production
            SameSite = SameSiteMode.Strict,
            Expires = DateTimeOffset.UtcNow.AddDays(7), // Refresh token expiry
            Path = "/"
        };

        Response.Cookies.Append("refresh_token", tokenResponse.RefreshToken, cookieOptions);

        // Return only access token to client
        return Ok(new LoginResponse
        {
            AccessToken = tokenResponse.AccessToken,
            ExpiresIn = tokenResponse.ExpiresIn,
            TokenType = tokenResponse.TokenType
        });
    }

    [HttpPost("refresh")]
    [AllowAnonymous]
    public async Task<IActionResult> RefreshToken()
    {
        // Get refresh token from HTTPOnly cookie
        if (!Request.Cookies.TryGetValue("refresh_token", out var refreshToken) ||
            string.IsNullOrEmpty(refreshToken))
        {
            return Unauthorized(new { error = "No refresh token found" });
        }

        var tokenResponse = await _keycloakService.RefreshTokenAsync(refreshToken);

        if (tokenResponse == null)
        {
            // Clear invalid refresh token cookie
            Response.Cookies.Delete("refresh_token");
            return Unauthorized(new { error = "Invalid or expired refresh token" });
        }

        // Update refresh token cookie with new token
        var cookieOptions = new CookieOptions
        {
            HttpOnly = true,
            Secure = Request.IsHttps,
            SameSite = SameSiteMode.Strict,
            Expires = DateTimeOffset.UtcNow.AddDays(7),
            Path = "/"
        };

        // Delete old cookie first, then set new one to ensure clean replacement
        Response.Cookies.Delete("refresh_token");
        Response.Cookies.Append("refresh_token", tokenResponse.RefreshToken, cookieOptions);

        // Return new access token
        return Ok(new LoginResponse
        {
            AccessToken = tokenResponse.AccessToken,
            ExpiresIn = tokenResponse.ExpiresIn,
            TokenType = tokenResponse.TokenType
        });
    }

    [HttpPost("logout")]
    [AllowAnonymous]
    public IActionResult Logout()
    {
        // Clear the refresh token cookie
        Response.Cookies.Delete("refresh_token");

        return Ok(new { message = "Logged out successfully" });
    }

    [HttpPost("signup")]
    [AllowAnonymous]
    public async Task<IActionResult> SignUp([FromBody] SignUpRequest request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var result = await _keycloakService.RegisterUserAsync(request);

        if (result.Success)
        {
            return Ok(new SignUpResponse
            {
                Success = true,
                UserId = result.UserId,
                Message = result.Message
            });
        }
        else
        {
            return BadRequest(new SignUpResponse
            {
                Success = false,
                UserId = "",
                Message = result.Message
            });
        }
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