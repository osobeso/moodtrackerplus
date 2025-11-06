import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { MoodSelectorComponent } from './components/mood-selector/mood-selector.component';
import { MoodHistoryComponent } from './components/mood-history/mood-history.component';
import { ToastComponent } from './components/toast/toast.component';

@NgModule({
  declarations: [
    App,
    MoodSelectorComponent,
    MoodHistoryComponent,
    ToastComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    provideBrowserGlobalErrorListeners()
  ],
  bootstrap: [App]
})
export class AppModule { }
