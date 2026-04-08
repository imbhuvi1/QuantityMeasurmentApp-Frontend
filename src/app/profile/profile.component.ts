import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ProfileService } from '../services/profile.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="dashboard-wrapper">
      <div class="glass-panel profile-card">
        <h2>User Profile</h2>
        <p class="subtitle">Manage your personal settings</p>
        
        <div class="badge-row">
          <span class="provider-badge">{{ profileData?.provider || 'LOCAL' }} LOGIN</span>
        </div>

        <form [formGroup]="profileForm" (ngSubmit)="onSave()">
          
          <div class="input-group">
            <label>Name</label>
            <input type="text" formControlName="name" placeholder="Your Name">
          </div>

          <div class="input-group">
            <label>Email Address</label>
            <input type="email" formControlName="email" class="readonly" readonly>
            <small>Email cannot be changed.</small>
          </div>

          <div class="input-group">
            <label>Phone Number</label>
            <input type="tel" formControlName="phone" placeholder="+1 234 567 8900">
          </div>

          <div class="input-group">
            <label>Bio</label>
            <textarea formControlName="bio" placeholder="Tell us about yourself..."></textarea>
          </div>

          <div class="success-msg" *ngIf="successMsg">{{ successMsg }}</div>

          <div class="action-buttons">
            <button type="submit" class="save-btn" [disabled]="profileForm.pristine">Save Changes</button>
            <button type="button" class="logout-btn" (click)="logout()">Log Out</button>
          </div>

        </form>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-wrapper { display: flex; justify-content: center; padding-top: 20px; }
    .profile-card { width: 500px; padding: 40px; }
    h2 { margin: 0; color: var(--primary-accent); text-align: center; }
    .subtitle { color: var(--text-muted); text-align: center; margin-bottom: 20px; }
    
    .badge-row { display: flex; justify-content: center; margin-bottom: 30px; }
    .provider-badge {
      background: rgba(108, 92, 231, 0.2);
      color: var(--primary-accent);
      border: 1px solid var(--primary-accent);
      font-size: 0.75rem;
      font-weight: bold;
      padding: 4px 12px;
      border-radius: 20px;
    }

    .input-group { margin-bottom: 20px; }
    label { display: block; margin-bottom: 8px; font-size: 0.9rem; color: var(--text-muted); }
    input, textarea {
      width: 100%;
      padding: 12px;
      border-radius: 8px;
      border: 1px solid var(--glass-border);
      background: rgba(0,0,0,0.2);
      color: var(--text-light);
      font-family: var(--font-family);
    }
    textarea { min-height: 100px; resize: vertical; }
    input:focus, textarea:focus { outline: none; border-color: var(--primary-accent); }
    input.readonly { opacity: 0.5; background: rgba(0,0,0,0.5); cursor: not-allowed; }
    small { display: block; margin-top: 5px; color: var(--text-muted); font-size: 0.75rem; }

    .action-buttons { display: flex; gap: 15px; margin-top: 30px; }
    
    .save-btn {
      flex: 2; padding: 12px; border-radius: 8px; border: none;
      background: var(--primary-accent); color: white; font-weight: 600;
      transition: background 0.3s ease;
    }
    .save-btn:hover:not(:disabled) { background: var(--primary-accent-hover); }
    .save-btn:disabled { opacity: 0.5; cursor: default; }

    .logout-btn {
      flex: 1; padding: 12px; border-radius: 8px;
      background: transparent; color: #ff6b6b; border: 1px solid #ff6b6b;
      font-weight: 600; transition: all 0.3s ease;
    }
    .logout-btn:hover { background: rgba(255, 107, 107, 0.1); }

    .success-msg { color: #4cd137; text-align: center; margin-top: 15px; font-size: 0.9rem; }
  `]
})
export class ProfileComponent implements OnInit {
  private fb = inject(FormBuilder);
  private profileService = inject(ProfileService);
  private authService = inject(AuthService);
  private router = inject(Router);

  profileData: any;
  successMsg = '';

  profileForm = this.fb.group({
    name: [''],
    email: [''],
    phone: [''],
    bio: ['']
  });

  ngOnInit() {
    this.profileService.getProfile().subscribe({
      next: (res: any) => {
        if(res && res.data) {
          this.profileData = res.data;
          this.profileForm.patchValue({
            name: this.profileData.name || '',
            email: this.profileData.email || '',
            phone: this.profileData.phone || '',
            bio: this.profileData.bio || ''
          });
        }
      },
      error: (err) => console.error("Could not fetch profile", err)
    });
  }

  onSave() {
    this.successMsg = '';
    this.profileService.updateProfile(this.profileForm.value).subscribe({
      next: () => {
        this.successMsg = 'Profile saved successfully!';
        this.profileForm.markAsPristine();
      },
      error: () => this.successMsg = 'Error saving profile.'
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
