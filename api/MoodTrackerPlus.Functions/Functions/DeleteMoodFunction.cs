using System.Net;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using MoodTrackerPlus.Functions.Helpers;
using MoodTrackerPlus.Functions.Services;

namespace MoodTrackerPlus.Functions.Functions;

public class DeleteMoodFunction
{
    private readonly IMoodRepository _repository;
    private readonly ILogger<DeleteMoodFunction> _logger;

    public DeleteMoodFunction(IMoodRepository repository, ILogger<DeleteMoodFunction> logger)
    {
        _repository = repository;
        _logger = logger;
    }

    [Function("DeleteMood")]
    public async Task<HttpResponseData> Run(
        [HttpTrigger(AuthorizationLevel.Anonymous, "delete", Route = "moods/{partitionKey}/{rowKey}")] 
        HttpRequestData req,
        string partitionKey,
        string rowKey)
    {
        _logger.LogInformation("DeleteMood function processing request for {PartitionKey}/{RowKey}", partitionKey, rowKey);

        try
        {
            var userId = AuthHelper.GetUserId(req);

            // Ensure user can only delete their own entries
            if (partitionKey != userId)
            {
                return await ProblemDetailsHelper.CreateProblemResponse(
                    req,
                    HttpStatusCode.Forbidden,
                    "Access denied",
                    "You can only delete your own mood entries");
            }

            var deleted = await _repository.DeleteAsync(partitionKey, rowKey);

            if (!deleted)
            {
                return await ProblemDetailsHelper.CreateProblemResponse(
                    req,
                    HttpStatusCode.NotFound,
                    "Not found",
                    "Mood entry not found");
            }

            var response = req.CreateResponse(HttpStatusCode.NoContent);
            return response;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting mood entry");
            return await ProblemDetailsHelper.CreateProblemResponse(
                req,
                HttpStatusCode.InternalServerError,
                "Internal server error",
                "An error occurred while deleting the mood entry");
        }
    }
}
