namespace MoodTrackerPlus.Functions.DTOs;

public class MoodEntryResponse
{
    public string PartitionKey { get; set; } = string.Empty;
    public string RowKey { get; set; } = string.Empty;
    public int MoodValue { get; set; }
    public string? Notes { get; set; }
    public DateTime CreatedUtc { get; set; }
    public string Date { get; set; } = string.Empty;
}
