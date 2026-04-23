import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private http = inject(HttpClient);
  private baseUrl = 'https://quantitymeasurmentapp-w8tb.onrender.com/api/user/profile';

  getProfile() {
    return this.http.get<any>(this.baseUrl);
  }

  updateProfile(data: any) {
    return this.http.put<any>(this.baseUrl, data);
  }
}
