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
- **LocalStorage API**: For persistent data storage
- **CSS3**: Modern styling with gradients and animations

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

