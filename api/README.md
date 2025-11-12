# MoodTrackerPlus Azure Functions Backend

This directory contains the Azure Functions backend for MoodTrackerPlus, built with .NET 8 isolated process model.

## Project Structure

```
api/
└── MoodTrackerPlus.Functions/
    ├── DTOs/                    # Data Transfer Objects
    │   ├── CreateMoodRequest.cs
    │   ├── MoodEntryResponse.cs
    │   └── MoodStatsResponse.cs
    ├── Functions/               # HTTP Trigger Functions
    │   ├── CreateMoodFunction.cs
    │   ├── ListMoodsFunction.cs
    │   ├── DeleteMoodFunction.cs
    │   └── GetMoodStatsFunction.cs
    ├── Helpers/                 # Utility classes
    │   ├── AuthHelper.cs
    │   ├── ValidationHelper.cs
    │   └── ProblemDetailsHelper.cs
    ├── Models/                  # Data models
    │   └── MoodEntryEntity.cs
    ├── Services/                # Business logic
    │   ├── IMoodRepository.cs
    │   └── TableStorageMoodRepository.cs
    ├── Program.cs               # App configuration and DI
    ├── host.json                # Functions host configuration
    └── local.settings.json.example
```

## Prerequisites

- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [Azure Functions Core Tools](https://docs.microsoft.com/azure/azure-functions/functions-run-local) v4.x
- [Azurite](https://docs.microsoft.com/azure/storage/common/storage-use-azurite) (for local development)

## Local Development Setup

### 1. Install Dependencies

```bash
cd api/MoodTrackerPlus.Functions
dotnet restore
```

### 2. Configure Local Settings

Create a `local.settings.json` file from the example:

```bash
cp local.settings.json.example local.settings.json
```

Edit `local.settings.json` if needed. Default configuration:

```json
{
  "IsEncrypted": false,
  "Values": {
    "AzureWebJobsStorage": "UseDevelopmentStorage=true",
    "FUNCTIONS_WORKER_RUNTIME": "dotnet-isolated",
    "APPLICATIONINSIGHTS_CONNECTION_STRING": "",
    "TableStorageConnectionString": "UseDevelopmentStorage=true"
  }
}
```

### 3. Start Azurite

Run Azurite (Azure Storage Emulator) in a separate terminal:

```bash
# Using npm
npm install -g azurite
azurite --silent --location .azurite

# Or using Docker
docker run -p 10000:10000 -p 10001:10001 -p 10002:10002 mcr.microsoft.com/azure-storage/azurite
```

### 4. Run the Functions

```bash
cd api/MoodTrackerPlus.Functions
func start
```

The API will be available at `http://localhost:7071/api`

## API Reference

### Create Mood Entry

```http
POST /api/moods
Content-Type: application/json

{
  "moodValue": 5,
  "notes": "Feeling great today!",
  "date": "2025-11-12T10:00:00Z"  // optional, defaults to now
}
```

**Response:** 201 Created
```json
{
  "partitionKey": "anon",
  "rowKey": "abc123-...",
  "moodValue": 5,
  "notes": "Feeling great today!",
  "createdUtc": "2025-11-12T10:00:00Z",
  "date": "2025-11-12"
}
```

### List Mood Entries

```http
GET /api/moods?from=2025-11-01&to=2025-11-30
```

**Response:** 200 OK
```json
[
  {
    "partitionKey": "anon",
    "rowKey": "abc123-...",
    "moodValue": 5,
    "notes": "Feeling great today!",
    "createdUtc": "2025-11-12T10:00:00Z",
    "date": "2025-11-12"
  }
]
```

### Delete Mood Entry

```http
DELETE /api/moods/{partitionKey}/{rowKey}
```

**Response:** 204 No Content

### Get Statistics

```http
GET /api/moods/stats?from=2025-11-01&to=2025-11-30
```

**Response:** 200 OK
```json
{
  "countPerMood": {
    "1": 5,
    "2": 3,
    "3": 10,
    "4": 8,
    "5": 12,
    "6": 7
  },
  "averagePerDay": {
    "2025-11-12": 4.5,
    "2025-11-13": 3.2
  },
  "totalEntries": 45,
  "overallAverage": 3.8
}
```

## Data Model

### MoodEntryEntity (Table Storage)

- **PartitionKey**: User ID from authentication or "anon" for anonymous users
- **RowKey**: GUID (unique identifier for the mood entry)
- **MoodValue**: Integer (1-6 representing the mood)
  - 1: Sad 😢
  - 2: Angry 😠
  - 3: Anxious 😰
  - 4: Calm 😌
  - 5: Happy 😊
  - 6: Excited 🤩
- **Notes**: String (optional notes about the mood)
- **CreatedUtc**: DateTime (when the entry was created)
- **Date**: String (yyyy-MM-dd format for efficient querying)
- **Timestamp**: DateTimeOffset (Table Storage built-in)
- **ETag**: ETag (Table Storage built-in)

## Authentication

The Functions use Azure Static Web Apps authentication. The `AuthHelper` class extracts user identity from the `x-ms-client-principal` header:

- **Authenticated users**: Entries stored with user's unique ID
- **Anonymous users**: Entries stored under "anon" partition

## Error Handling

All functions use consistent error responses following the [Problem Details](https://tools.ietf.org/html/rfc7807) specification:

```json
{
  "type": "https://httpstatuses.com/400",
  "title": "Validation error",
  "status": 400,
  "detail": "MoodValue must be between 1 and 6"
}
```

## Testing

### Unit Tests

```bash
cd api/MoodTrackerPlus.Functions.Tests
dotnet test
```

### Manual Testing

Use the provided `test.http` file with the REST Client extension in VS Code, or use curl:

```bash
# Create
curl -X POST http://localhost:7071/api/moods \
  -H "Content-Type: application/json" \
  -d '{"moodValue": 5, "notes": "Great day!"}'

# List
curl http://localhost:7071/api/moods

# Stats
curl http://localhost:7071/api/moods/stats

# Delete (use actual keys from create response)
curl -X DELETE http://localhost:7071/api/moods/anon/your-row-key
```

## Deployment

The backend is deployed automatically via GitHub Actions when pushing to the main branch. See `.github/workflows/azure-static-web-apps.yml` for the workflow configuration.

### Environment Variables (Production)

Configure these in your Azure Static Web App:

- `TableStorageConnectionString`: Connection string to Azure Storage Account
- `APPLICATIONINSIGHTS_CONNECTION_STRING`: Application Insights connection string (optional)

## Observability

The Functions include:
- **Structured logging** with ILogger
- **Application Insights** integration for telemetry
- **Error tracking** with detailed context (userId, partitionKey, rowKey)

## Repository Pattern

The `IMoodRepository` interface provides an abstraction over the data access layer:

```csharp
public interface IMoodRepository
{
    Task<MoodEntryEntity> CreateAsync(MoodEntryEntity entry);
    Task<List<MoodEntryEntity>> ListAsync(string userId, DateTime? from, DateTime? to);
    Task<bool> DeleteAsync(string partitionKey, string rowKey);
    Task<MoodEntryEntity?> GetAsync(string partitionKey, string rowKey);
}
```

This allows for:
- Easy testing with mock implementations
- Future migration to other storage backends (e.g., Cosmos DB)
- Clear separation of concerns

## Performance Considerations

- **Table Storage** is optimized for partition key queries
- Entries are partitioned by userId for efficient querying
- Date field is indexed as a string (yyyy-MM-dd) for range queries
- Entries are returned in descending order by CreatedUtc

## Security

- **Input validation**: MoodValue must be between 1-6
- **Authorization**: Users can only delete their own entries
- **CORS**: Configured via Azure Static Web Apps
- **No secrets in code**: All configuration via environment variables

## License

See the main project LICENSE file.
