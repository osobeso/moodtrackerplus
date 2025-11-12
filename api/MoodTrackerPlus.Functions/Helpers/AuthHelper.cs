using System.Text;
using System.Text.Json;
using Microsoft.Azure.Functions.Worker.Http;

namespace MoodTrackerPlus.Functions.Helpers;

public static class AuthHelper
{
    public static string GetUserId(HttpRequestData req)
    {
        // Try to get the Static Web Apps auth principal
        if (req.Headers.TryGetValues("x-ms-client-principal", out var principalValues))
        {
            var principal = principalValues.FirstOrDefault();
            if (!string.IsNullOrEmpty(principal))
            {
                try
                {
                    var decoded = Convert.FromBase64String(principal);
                    var json = Encoding.UTF8.GetString(decoded);
                    var principalData = JsonSerializer.Deserialize<ClientPrincipal>(json);
                    
                    if (principalData?.UserId != null)
                    {
                        return principalData.UserId;
                    }
                }
                catch
                {
                    // If parsing fails, fall through to anon
                }
            }
        }

        // Fallback to anonymous user
        return "anon";
    }

    private class ClientPrincipal
    {
        public string? UserId { get; set; }
        public string? UserRoles { get; set; }
        public string? IdentityProvider { get; set; }
        public IEnumerable<Claim>? Claims { get; set; }
    }

    private class Claim
    {
        public string? Type { get; set; }
        public string? Value { get; set; }
    }
}
