# Mood Tracker Plus 😊

A simple and beautiful mood tracking application built with Angular. Track your emotional journey with ease!

## Features

✨ **Mood Selection**: Choose from 6 different moods with colorful emoji buttons:
- 😊 Happy
- 😢 Sad
- 😠 Angry
- 😰 Anxious
- 😌 Calm
- 🤩 Excited

📊 **History Tracking**: View all your mood entries with timestamps
💾 **Local Storage**: All data is saved locally in your browser using localStorage
🗑️ **Delete Entries**: Remove individual mood entries or clear all history
⏰ **Smart Time Display**: Shows relative time (e.g., "5 minutes ago") for recent entries

## How to Use

### Running the Application

1. **Install dependencies** (if not already done):
   ```bash
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm start
   ```
   or
   ```bash
   ng serve
   ```

3. **Open your browser** and navigate to:
   ```
   http://127.0.0.1:50231
   ```

### Tracking Your Mood

1. On the main page, click on any mood button that represents how you're feeling
2. Your mood will be automatically saved with the current date and time
3. Click "View History" to see all your past mood entries

### Viewing History

- Click the "View History" button on the main page
- See all your mood entries listed with timestamps
- Delete individual entries by clicking the trash icon
- Clear all history with the "Clear All" button
- Click "Back" to return to the mood selection page

## Technical Details

### Project Structure

```
MoodTrackerPlus/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── mood-selector/      # Main mood selection page
│   │   │   └── mood-history/       # History viewing page
│   │   ├── models/
│   │   │   └── mood-entry.model.ts # Data model for mood entries
│   │   ├── services/
│   │   │   └── mood-storage.service.ts # Local storage service
│   │   ├── app-module.ts
│   │   ├── app-routing-module.ts
│   │   ├── app.ts
│   │   └── app.html
│   ├── styles.css                  # Global styles
│   └── main.ts
├── package.json
└── angular.json
```

### Data Storage

The app uses the browser's `localStorage` API to store mood entries. Data persists between sessions and is stored as JSON. Each mood entry includes:
- **id**: Unique identifier
- **mood**: The mood name (e.g., "Happy")
- **emoji**: The emoji representation
- **timestamp**: Date and time when the mood was recorded

### Technologies Used

- **Angular 20**: Modern Angular framework
- **TypeScript**: Type-safe development
- **LocalStorage API**: For persistent data storage (frontend fallback)
- **Azure Functions**: Serverless backend API
- **Azure Table Storage**: Cloud data persistence
- **CSS3**: Modern styling with gradients and animations

---

## Backend API

The application includes a serverless backend built with Azure Functions (.NET 8 isolated process) and Azure Table Storage for cloud data persistence.

### API Endpoints

- **POST /api/moods** - Create a new mood entry
  - Body: `{ "moodValue": 1-6, "notes": "optional", "date": "optional ISO date" }`
  - Returns: Created mood entry with partition key and row key

- **GET /api/moods?from=yyyy-MM-dd&to=yyyy-MM-dd** - List mood entries
  - Query Parameters: `from` and `to` (optional date range)
  - Returns: Array of mood entries for the authenticated user

- **DELETE /api/moods/{partitionKey}/{rowKey}** - Delete a specific mood entry
  - Returns: 204 No Content on success

- **GET /api/moods/stats?from=yyyy-MM-dd&to=yyyy-MM-dd** - Get aggregate statistics
  - Query Parameters: `from` and `to` (optional date range)
  - Returns: Count per mood, average per day, total entries, overall average

### Local Development

#### Prerequisites
- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [Azure Functions Core Tools](https://docs.microsoft.com/azure/azure-functions/functions-run-local)
- [Azurite](https://docs.microsoft.com/azure/storage/common/storage-use-azurite) (Azure Storage Emulator)

#### Running the Backend Locally

1. **Start Azurite** (Azure Storage Emulator):
   ```bash
   azurite --silent --location .azurite --debug .azurite\debug.log
   ```

2. **Configure local settings**:
   ```bash
   cd api/MoodTrackerPlus.Functions
   cp local.settings.json.example local.settings.json
   ```
   
   The default configuration uses `UseDevelopmentStorage=true` which connects to Azurite.

3. **Start the Functions runtime**:
   ```bash
   cd api/MoodTrackerPlus.Functions
   func start
   ```
   
   Or use the .NET CLI:
   ```bash
   cd api/MoodTrackerPlus.Functions
   dotnet build
   dotnet run
   ```

4. **Test the API**:
   ```bash
   # Create a mood entry
   curl -X POST http://localhost:7071/api/moods \
     -H "Content-Type: application/json" \
     -d '{"moodValue": 5, "notes": "Feeling great!"}'
   
   # List mood entries
   curl http://localhost:7071/api/moods
   
   # Get statistics
   curl http://localhost:7071/api/moods/stats
   ```

### Authentication

The backend uses Azure Static Web Apps built-in authentication (Easy Auth). The authentication helper extracts the user ID from the `X-MS-CLIENT-PRINCIPAL` header provided by Static Web Apps.

- **Authenticated users**: Mood entries are stored with their user ID as the partition key
- **Anonymous users**: Mood entries are stored under the "anon" partition key

### Deployment

The application is designed to be deployed via Azure Static Web Apps with a linked Functions backend:

1. **Create an Azure Static Web App** in the Azure Portal
2. **Configure the GitHub Actions workflow** by adding the `AZURE_STATIC_WEB_APPS_API_TOKEN` secret
3. **Push to the main branch** to trigger automatic deployment

The workflow builds both the Angular frontend and the Azure Functions backend, deploying them together as a single Static Web App.

### Infrastructure

The backend requires:
- **Azure Storage Account** with Table Storage for storing mood entries
- **Azure Functions** (Flex Consumption plan recommended)
- **Application Insights** (optional, for monitoring and telemetry)

---

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.3.7.

## Additional Angular CLI Commands

### Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

### Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

### Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

