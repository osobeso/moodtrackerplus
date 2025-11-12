using System.Net;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using MoodTrackerPlus.Functions.DTOs;
using MoodTrackerPlus.Functions.Helpers;
using MoodTrackerPlus.Functions.Models;
using MoodTrackerPlus.Functions.Services;

namespace MoodTrackerPlus.Functions.Functions;

public class CreateMoodFunction
{
    private readonly IMoodRepository _repository;
    private readonly ILogger<CreateMoodFunction> _logger;

    public CreateMoodFunction(IMoodRepository repository, ILogger<CreateMoodFunction> logger)
    {
        _repository = repository;
        _logger = logger;
    }

    [Function("CreateMood")]
    public async Task<HttpResponseData> Run(
        [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "moods")] HttpRequestData req)
    {
        _logger.LogInformation("CreateMood function processing request");

        try
        {
            var userId = AuthHelper.GetUserId(req);
            var request = await req.ReadFromJsonAsync<CreateMoodRequest>();

            if (request == null)
            {
                return await ProblemDetailsHelper.CreateProblemResponse(
                    req,
                    HttpStatusCode.BadRequest,
                    "Invalid request",
                    "Request body is required");
            }

            // Validate mood value
            var (isValid, errorMessage) = ValidationHelper.ValidateMoodValue(request.MoodValue);
            if (!isValid)
            {
                return await ProblemDetailsHelper.CreateProblemResponse(
                    req,
                    HttpStatusCode.BadRequest,
                    "Validation error",
                    errorMessage);
            }

            // Create entry
            var now = DateTime.UtcNow;
            var date = request.Date ?? now;
            var normalizedDate = ValidationHelper.NormalizeDateToUtc(date);

            var entity = new MoodEntryEntity
            {
                PartitionKey = userId,
                RowKey = Guid.NewGuid().ToString(),
                MoodValue = request.MoodValue,
                Notes = request.Notes,
                CreatedUtc = now,
                Date = ValidationHelper.FormatDate(normalizedDate)
            };

            var createdEntity = await _repository.CreateAsync(entity);

            var response = req.CreateResponse(HttpStatusCode.Created);
            await response.WriteAsJsonAsync(new MoodEntryResponse
            {
                PartitionKey = createdEntity.PartitionKey,
                RowKey = createdEntity.RowKey,
                MoodValue = createdEntity.MoodValue,
                Notes = createdEntity.Notes,
                CreatedUtc = createdEntity.CreatedUtc,
                Date = createdEntity.Date
            });

            return response;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating mood entry");
            return await ProblemDetailsHelper.CreateProblemResponse(
                req,
                HttpStatusCode.InternalServerError,
                "Internal server error",
                "An error occurred while creating the mood entry");
        }
    }
}
