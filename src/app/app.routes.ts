import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { MeasurementComponent } from './measurement/measurement.component';
import { HistoryComponent } from './history/history.component';
import { ProfileComponent } from './profile/profile.component';

export const routes: Routes = [
  { path: '', component: MeasurementComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'history', component: HistoryComponent },
  { path: 'profile', component: ProfileComponent },
];
