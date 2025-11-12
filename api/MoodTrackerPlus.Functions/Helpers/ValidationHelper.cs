namespace MoodTrackerPlus.Functions.Helpers;

public static class ValidationHelper
{
    private const int MinMoodValue = 1;
    private const int MaxMoodValue = 6;

    public static (bool IsValid, string? ErrorMessage) ValidateMoodValue(int moodValue)
    {
        if (moodValue < MinMoodValue || moodValue > MaxMoodValue)
        {
            return (false, $"MoodValue must be between {MinMoodValue} and {MaxMoodValue}");
        }
        return (true, null);
    }

    public static DateTime NormalizeDateToUtc(DateTime date)
    {
        return date.Kind == DateTimeKind.Utc ? date : date.ToUniversalTime();
    }

    public static string FormatDate(DateTime date)
    {
        return date.ToString("yyyy-MM-dd");
    }
}
