using Azure.Data.Tables;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using MoodTrackerPlus.Functions.Models;

namespace MoodTrackerPlus.Functions.Services;

public class TableStorageMoodRepository : IMoodRepository
{
    private readonly TableClient _tableClient;
    private readonly ILogger<TableStorageMoodRepository> _logger;
    private const string TableName = "MoodEntries";

    public TableStorageMoodRepository(IConfiguration configuration, ILogger<TableStorageMoodRepository> logger)
    {
        _logger = logger;
        var connectionString = configuration["TableStorageConnectionString"] 
            ?? throw new InvalidOperationException("TableStorageConnectionString is not configured");
        
        var tableServiceClient = new TableServiceClient(connectionString);
        _tableClient = tableServiceClient.GetTableClient(TableName);
        _tableClient.CreateIfNotExists();
    }

    public async Task<MoodEntryEntity> CreateAsync(MoodEntryEntity entry)
    {
        _logger.LogInformation("Creating mood entry for user {UserId}", entry.PartitionKey);
        await _tableClient.AddEntityAsync(entry);
        return entry;
    }

    public async Task<List<MoodEntryEntity>> ListAsync(string userId, DateTime? from, DateTime? to)
    {
        _logger.LogInformation("Listing mood entries for user {UserId} from {From} to {To}", userId, from, to);
        
        var filter = $"PartitionKey eq '{userId}'";
        
        if (from.HasValue)
        {
            var fromDate = from.Value.ToString("yyyy-MM-dd");
            filter += $" and Date ge '{fromDate}'";
        }
        
        if (to.HasValue)
        {
            var toDate = to.Value.ToString("yyyy-MM-dd");
            filter += $" and Date le '{toDate}'";
        }

        var entries = new List<MoodEntryEntity>();
        await foreach (var entry in _tableClient.QueryAsync<MoodEntryEntity>(filter))
        {
            entries.Add(entry);
        }

        return entries.OrderByDescending(e => e.CreatedUtc).ToList();
    }

    public async Task<bool> DeleteAsync(string partitionKey, string rowKey)
    {
        _logger.LogInformation("Deleting mood entry {PartitionKey}/{RowKey}", partitionKey, rowKey);
        
        try
        {
            await _tableClient.DeleteEntityAsync(partitionKey, rowKey);
            return true;
        }
        catch (Azure.RequestFailedException ex) when (ex.Status == 404)
        {
            _logger.LogWarning("Mood entry {PartitionKey}/{RowKey} not found", partitionKey, rowKey);
            return false;
        }
    }

    public async Task<MoodEntryEntity?> GetAsync(string partitionKey, string rowKey)
    {
        _logger.LogInformation("Getting mood entry {PartitionKey}/{RowKey}", partitionKey, rowKey);
        
        try
        {
            var response = await _tableClient.GetEntityAsync<MoodEntryEntity>(partitionKey, rowKey);
            return response.Value;
        }
        catch (Azure.RequestFailedException ex) when (ex.Status == 404)
        {
            _logger.LogWarning("Mood entry {PartitionKey}/{RowKey} not found", partitionKey, rowKey);
            return null;
        }
    }
}
