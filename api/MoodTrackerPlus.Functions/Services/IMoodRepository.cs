using MoodTrackerPlus.Functions.Models;

namespace MoodTrackerPlus.Functions.Services;

public interface IMoodRepository
{
    Task<MoodEntryEntity> CreateAsync(MoodEntryEntity entry);
    Task<List<MoodEntryEntity>> ListAsync(string userId, DateTime? from, DateTime? to);
    Task<bool> DeleteAsync(string partitionKey, string rowKey);
    Task<MoodEntryEntity?> GetAsync(string partitionKey, string rowKey);
}
