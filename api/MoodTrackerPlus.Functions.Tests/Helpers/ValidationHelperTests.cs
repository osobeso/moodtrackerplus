using MoodTrackerPlus.Functions.Helpers;

namespace MoodTrackerPlus.Functions.Tests.Helpers;

public class ValidationHelperTests
{
    [Theory]
    [InlineData(1, true)]
    [InlineData(2, true)]
    [InlineData(3, true)]
    [InlineData(4, true)]
    [InlineData(5, true)]
    [InlineData(6, true)]
    [InlineData(0, false)]
    [InlineData(7, false)]
    [InlineData(-1, false)]
    [InlineData(100, false)]
    public void ValidateMoodValue_ShouldValidateCorrectly(int moodValue, bool expectedValid)
    {
        // Act
        var (isValid, errorMessage) = ValidationHelper.ValidateMoodValue(moodValue);

        // Assert
        Assert.Equal(expectedValid, isValid);
        if (!expectedValid)
        {
            Assert.NotNull(errorMessage);
        }
        else
        {
            Assert.Null(errorMessage);
        }
    }

    [Fact]
    public void NormalizeDateToUtc_ShouldConvertToUtc()
    {
        // Arrange
        var localDate = new DateTime(2025, 11, 12, 10, 30, 0, DateTimeKind.Local);

        // Act
        var result = ValidationHelper.NormalizeDateToUtc(localDate);

        // Assert
        Assert.Equal(DateTimeKind.Utc, result.Kind);
    }

    [Fact]
    public void NormalizeDateToUtc_ShouldKeepUtcDates()
    {
        // Arrange
        var utcDate = new DateTime(2025, 11, 12, 10, 30, 0, DateTimeKind.Utc);

        // Act
        var result = ValidationHelper.NormalizeDateToUtc(utcDate);

        // Assert
        Assert.Equal(DateTimeKind.Utc, result.Kind);
        Assert.Equal(utcDate, result);
    }

    [Fact]
    public void FormatDate_ShouldReturnCorrectFormat()
    {
        // Arrange
        var date = new DateTime(2025, 11, 12);

        // Act
        var result = ValidationHelper.FormatDate(date);

        // Assert
        Assert.Equal("2025-11-12", result);
    }
}
