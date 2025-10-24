import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { MoodSelectorComponent } from './components/mood-selector/mood-selector.component';
import { MoodHistoryComponent } from './components/mood-history/mood-history.component';
import { ToastComponent } from './components/toast/toast.component';
import { WeatherCorrelationComponent } from './components/weather-correlation/weather-correlation.component';

@NgModule({
  declarations: [
    App,
    MoodSelectorComponent,
    MoodHistoryComponent,
    ToastComponent,
    WeatherCorrelationComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [
    provideBrowserGlobalErrorListeners()
  ],
  bootstrap: [App]
})
export class AppModule { }
