namespace MoodTrackerPlus.Functions.DTOs;

public class CreateMoodRequest
{
    public int MoodValue { get; set; }
    public string? Notes { get; set; }
    public DateTime? Date { get; set; }
}
