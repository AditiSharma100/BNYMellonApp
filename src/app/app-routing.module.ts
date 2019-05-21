import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainWindowComponent } from './components/main-window/main-window.component';

const routes: Routes = [
  {
    path: '',
    component: MainWindowComponent
    //redirectTo: 'home',
    //pathMatch: 'full'
  },
  {
    path: 'home',
    component: MainWindowComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
