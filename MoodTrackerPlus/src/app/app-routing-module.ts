import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MoodSelectorComponent } from './components/mood-selector/mood-selector.component';
import { MoodHistoryComponent } from './components/mood-history/mood-history.component';

const routes: Routes = [
  { path: '', component: MoodSelectorComponent },
  { path: 'history', component: MoodHistoryComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
