import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="auth-wrapper">
      <div class="glass-panel auth-card">
        <h2>Create Account</h2>
        <p class="subtitle">Join the measurement dashboard</p>

        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
          
          <div class="input-group">
            <label>Full Name</label>
            <input type="text" formControlName="name" placeholder="John Doe">
          </div>

          <div class="input-group">
            <label>Email</label>
            <input type="email" formControlName="email" placeholder="example@email.com">
          </div>

          <div class="input-group">
            <label>Password</label>
            <input type="password" formControlName="password" placeholder="••••••••">
          </div>

          <div class="error-msg" *ngIf="errorMessage">{{ errorMessage }}</div>

          <button type="submit" [disabled]="registerForm.invalid">Register</button>
        </form>

        <p class="footer-link">Already have an account? <a routerLink="/login">Login here</a></p>
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
    .subtitle { color: var(--text-muted); margin-bottom: 20px; }
    .input-group {
      text-align: left;
      margin-bottom: 15px;
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
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  registerForm = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  errorMessage = '';

  onSubmit() {
    if (this.registerForm.valid) {
      this.authService.register(this.registerForm.value).subscribe({
        next: () => {
          this.router.navigate(['/login']); // Go to login after successful registration
        },
        error: (err) => {
          this.errorMessage = 'Error creating account. Please try again.';
        }
      });
    }
  }
}
