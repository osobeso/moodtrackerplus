namespace MoodTrackerPlus.Functions.DTOs;

public class MoodStatsResponse
{
    public Dictionary<int, int> CountPerMood { get; set; } = new();
    public Dictionary<string, double> AveragePerDay { get; set; } = new();
    public int TotalEntries { get; set; }
    public double OverallAverage { get; set; }
}
