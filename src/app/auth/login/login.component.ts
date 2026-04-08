import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="auth-wrapper">
      <div class="glass-panel auth-card">
        <h2>Welcome Back</h2>
        <p class="subtitle">Log in to your measurement dashboard</p>

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
          
          <div class="input-group">
            <label>Email</label>
            <input type="email" formControlName="email" placeholder="example@email.com">
          </div>

          <div class="input-group">
            <label>Password</label>
            <input type="password" formControlName="password" placeholder="••••••••">
          </div>

          <div class="error-msg" *ngIf="errorMessage">{{ errorMessage }}</div>

          <button type="submit" [disabled]="loginForm.invalid">Login</button>
        </form>

        <p class="footer-link">Don't have an account? <a routerLink="/register">Register here</a></p>
      </div>
    </div>
  `,
  styles: [`
    .auth-wrapper {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100%;
      margin-top: 50px;
    }
    .auth-card {
      width: 400px;
      padding: 40px;
      text-align: center;
    }
    h2 { margin-top: 0; color: var(--primary-accent); }
    .subtitle { color: var(--text-muted); margin-bottom: 30px; }
    .input-group {
      text-align: left;
      margin-bottom: 20px;
    }
    label { display: block; margin-bottom: 8px; font-size: 0.9rem; color: var(--text-muted); }
    input {
      width: 100%;
      padding: 12px;
      border-radius: 8px;
      border: 1px solid var(--glass-border);
      background: rgba(0,0,0,0.2);
      color: var(--text-light);
      font-family: var(--font-family);
    }
    input:focus { outline: none; border-color: var(--primary-accent); }
    button {
      width: 100%;
      padding: 14px;
      border-radius: 8px;
      border: none;
      background: var(--primary-accent);
      color: white;
      font-weight: 600;
      margin-top: 10px;
      transition: background 0.3s ease;
    }
    button:hover:not(:disabled) { background: var(--primary-accent-hover); }
    button:disabled { opacity: 0.5; cursor: not-allowed; }
    .error-msg { color: #ff6b6b; margin-bottom: 15px; font-size: 0.9rem; }
    .footer-link { margin-top: 25px; font-size: 0.9rem; color: var(--text-muted); }
    .footer-link a { color: var(--primary-accent); text-decoration: none; font-weight: 600; }
  `]
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  errorMessage = '';

  onSubmit() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: () => {
          this.router.navigate(['/']); // Go to calculator dashboard on success
        },
        error: (err) => {
          this.errorMessage = 'Invalid email or password.';
        }
      });
    }
  }
}
