using System.Net;
using System.Web;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using MoodTrackerPlus.Functions.DTOs;
using MoodTrackerPlus.Functions.Helpers;
using MoodTrackerPlus.Functions.Services;

namespace MoodTrackerPlus.Functions.Functions;

public class ListMoodsFunction
{
    private readonly IMoodRepository _repository;
    private readonly ILogger<ListMoodsFunction> _logger;

    public ListMoodsFunction(IMoodRepository repository, ILogger<ListMoodsFunction> logger)
    {
        _repository = repository;
        _logger = logger;
    }

    [Function("ListMoods")]
    public async Task<HttpResponseData> Run(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "moods")] HttpRequestData req)
    {
        _logger.LogInformation("ListMoods function processing request");

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

            var response = req.CreateResponse(HttpStatusCode.OK);
            await response.WriteAsJsonAsync(entries.Select(e => new MoodEntryResponse
            {
                PartitionKey = e.PartitionKey,
                RowKey = e.RowKey,
                MoodValue = e.MoodValue,
                Notes = e.Notes,
                CreatedUtc = e.CreatedUtc,
                Date = e.Date
            }));

            return response;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error listing mood entries");
            return await ProblemDetailsHelper.CreateProblemResponse(
                req,
                HttpStatusCode.InternalServerError,
                "Internal server error",
                "An error occurred while listing mood entries");
        }
    }
}
