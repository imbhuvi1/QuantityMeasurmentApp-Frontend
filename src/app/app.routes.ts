import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { MeasurementComponent } from './measurement/measurement.component';
import { HistoryComponent } from './history/history.component';
import { ProfileComponent } from './profile/profile.component';
import { OAuthCallbackComponent } from './auth/oauth-callback/oauth-callback.component';
import { authGuard } from './services/auth.guard';

export const routes: Routes = [
  { path: '', component: MeasurementComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'oauth-callback', component: OAuthCallbackComponent },
  { path: 'history', component: HistoryComponent, canActivate: [authGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },
];
