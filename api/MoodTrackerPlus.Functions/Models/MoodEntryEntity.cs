using Azure;
using Azure.Data.Tables;

namespace MoodTrackerPlus.Functions.Models;

public class MoodEntryEntity : ITableEntity
{
    public string PartitionKey { get; set; } = string.Empty;
    public string RowKey { get; set; } = string.Empty;
    public DateTimeOffset? Timestamp { get; set; }
    public ETag ETag { get; set; }

    public int MoodValue { get; set; }
    public string? Notes { get; set; }
    public DateTime CreatedUtc { get; set; }
    public string Date { get; set; } = string.Empty; // yyyy-MM-dd for efficient queries
}
