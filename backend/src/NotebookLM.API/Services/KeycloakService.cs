using NotebookLM.API.Models;
using System.Text;
using System.Text.Json;

namespace NotebookLM.API.Services;

public interface IKeycloakService
{
    Task<TokenResponse?> LoginAsync(string username, string password);
    Task<TokenResponse?> RefreshTokenAsync(string refreshToken);
    Task<(bool Success, string UserId, string Message)> RegisterUserAsync(SignUpRequest request);
    Task<string?> GetAdminTokenAsync();
}

public class KeycloakService : IKeycloakService
{
    private readonly HttpClient _httpClient;
    private readonly IConfiguration _configuration;
    private readonly string _tokenEndpoint;
    private readonly string _adminUsersEndpoint;
    private readonly string _clientId;
    private readonly string _keycloakUrl;

    public KeycloakService(HttpClient httpClient, IConfiguration configuration)
    {
        _httpClient = httpClient;
        _configuration = configuration;

        _keycloakUrl = _configuration["KEYCLOAK_INTERNAL_URL"] ?? "http://keycloak:8080";
        var realm = _configuration["KEYCLOAK_REALM"] ?? "notebooklm";
        _tokenEndpoint = $"{_keycloakUrl}/realms/{realm}/protocol/openid-connect/token";
        _adminUsersEndpoint = $"{_keycloakUrl}/admin/realms/{realm}/users";
        _clientId = _configuration["KEYCLOAK_CLIENT_ID"] ?? "notebooklm-frontend";
    }

    public async Task<TokenResponse?> LoginAsync(string username, string password)
    {
        var parameters = new List<KeyValuePair<string, string>>
        {
            new("grant_type", "password"),
            new("client_id", _clientId),
            new("username", username),
            new("password", password),
            new("scope", "openid profile email")
        };

        return await SendTokenRequestAsync(parameters);
    }

    public async Task<TokenResponse?> RefreshTokenAsync(string refreshToken)
    {
        var parameters = new List<KeyValuePair<string, string>>
        {
            new("grant_type", "refresh_token"),
            new("client_id", _clientId),
            new("refresh_token", refreshToken)
        };

        return await SendTokenRequestAsync(parameters);
    }

    public async Task<string?> GetAdminTokenAsync()
    {
        var parameters = new List<KeyValuePair<string, string>>
        {
            new("grant_type", "client_credentials"),
            new("client_id", "admin-cli"),
            // In production, use proper admin credentials
            new("username", _configuration["KEYCLOAK_ADMIN_USER"] ?? "admin"),
            new("password", _configuration["KEYCLOAK_ADMIN_PASSWORD"] ?? "admin"),
            new("grant_type", "password")
        };

        var tokenResponse = await SendTokenRequestAsync(parameters);
        return tokenResponse?.AccessToken;
    }

    public async Task<(bool Success, string UserId, string Message)> RegisterUserAsync(SignUpRequest request)
    {
        try
        {
            // Get admin token
            var adminToken = await GetAdminTokenAsync();
            if (string.IsNullOrEmpty(adminToken))
            {
                return (false, "", "Failed to authenticate with Keycloak admin");
            }

            // Create user object
            var newUser = new
            {
                username = request.Username,
                email = request.Email,
                firstName = request.FirstName,
                lastName = request.LastName,
                enabled = true,
                emailVerified = false,
                credentials = new[]
                {
                    new
                    {
                        type = "password",
                        value = request.Password,
                        temporary = false
                    }
                }
            };

            var jsonContent = JsonSerializer.Serialize(newUser);
            var content = new StringContent(jsonContent, Encoding.UTF8, "application/json");

            // Set authorization header
            _httpClient.DefaultRequestHeaders.Clear();
            _httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {adminToken}");

            var response = await _httpClient.PostAsync(_adminUsersEndpoint, content);

            if (response.IsSuccessStatusCode)
            {
                // Get user ID from Location header
                var location = response.Headers.Location?.ToString() ?? "";
                var userId = location.Split('/').LastOrDefault() ?? "";

                return (true, userId, "User created successfully");
            }
            else
            {
                var errorContent = await response.Content.ReadAsStringAsync();
                return (false, "", $"Failed to create user: {errorContent}");
            }
        }
        catch (Exception ex)
        {
            return (false, "", $"Error creating user: {ex.Message}");
        }
    }

    private async Task<TokenResponse?> SendTokenRequestAsync(List<KeyValuePair<string, string>> parameters)
    {
        try
        {
            var content = new FormUrlEncodedContent(parameters);
            var response = await _httpClient.PostAsync(_tokenEndpoint, content);

            if (!response.IsSuccessStatusCode)
            {
                return null;
            }

            var jsonContent = await response.Content.ReadAsStringAsync();
            return JsonSerializer.Deserialize<TokenResponse>(jsonContent);
        }
        catch
        {
            return null;
        }
    }
}