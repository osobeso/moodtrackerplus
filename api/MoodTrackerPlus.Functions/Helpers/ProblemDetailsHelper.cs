using System.Net;
using System.Text.Json;
using Microsoft.Azure.Functions.Worker.Http;

namespace MoodTrackerPlus.Functions.Helpers;

public static class ProblemDetailsHelper
{
    public static async Task<HttpResponseData> CreateProblemResponse(
        HttpRequestData req,
        HttpStatusCode statusCode,
        string title,
        string? detail = null)
    {
        var response = req.CreateResponse(statusCode);
        response.Headers.Add("Content-Type", "application/problem+json");

        var problemDetails = new
        {
            type = $"https://httpstatuses.com/{(int)statusCode}",
            title,
            status = (int)statusCode,
            detail
        };

        await response.WriteAsJsonAsync(problemDetails);
        return response;
    }
}
