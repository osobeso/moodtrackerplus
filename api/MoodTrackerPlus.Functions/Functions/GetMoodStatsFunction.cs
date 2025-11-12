using System.Net;
using System.Web;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using MoodTrackerPlus.Functions.DTOs;
using MoodTrackerPlus.Functions.Helpers;
using MoodTrackerPlus.Functions.Services;

namespace MoodTrackerPlus.Functions.Functions;

public class GetMoodStatsFunction
{
    private readonly IMoodRepository _repository;
    private readonly ILogger<GetMoodStatsFunction> _logger;

    public GetMoodStatsFunction(IMoodRepository repository, ILogger<GetMoodStatsFunction> logger)
    {
        _repository = repository;
        _logger = logger;
    }

    [Function("GetMoodStats")]
    public async Task<HttpResponseData> Run(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "moods/stats")] HttpRequestData req)
    {
        _logger.LogInformation("GetMoodStats function processing request");

        try
        {
            var userId = AuthHelper.GetUserId(req);
            var query = HttpUtility.ParseQueryString(req.Url.Query);

            DateTime? from = null;
            DateTime? to = null;

            var fromStr = query["from"];
            if (!string.IsNullOrEmpty(fromStr) && DateTime.TryParse(fromStr, out var fromDate))
            {
                from = fromDate;
            }

            var toStr = query["to"];
            if (!string.IsNullOrEmpty(toStr) && DateTime.TryParse(toStr, out var toDate))
            {
                to = toDate;
            }

            var entries = await _repository.ListAsync(userId, from, to);

            // Calculate statistics
            var countPerMood = entries
                .GroupBy(e => e.MoodValue)
                .ToDictionary(g => g.Key, g => g.Count());

            var averagePerDay = entries
                .GroupBy(e => e.Date)
                .ToDictionary(
                    g => g.Key,
                    g => g.Average(e => e.MoodValue));

            var stats = new MoodStatsResponse
            {
                CountPerMood = countPerMood,
                AveragePerDay = averagePerDay,
                TotalEntries = entries.Count,
                OverallAverage = entries.Any() ? entries.Average(e => e.MoodValue) : 0
            };

            var response = req.CreateResponse(HttpStatusCode.OK);
            await response.WriteAsJsonAsync(stats);

            return response;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error calculating mood statistics");
            return await ProblemDetailsHelper.CreateProblemResponse(
                req,
                HttpStatusCode.InternalServerError,
                "Internal server error",
                "An error occurred while calculating mood statistics");
        }
    }
}
