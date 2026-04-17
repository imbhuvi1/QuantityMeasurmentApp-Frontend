import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MeasurementService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:8080/api/quantity';

  compare(payload: any) {
    return this.http.post(`${this.baseUrl}/compare`, payload);
  }

  convert(q1: any, targetUnit: string) {
    return this.http.post(`${this.baseUrl}/convert`, { quantity: q1, targetUnit });
  }

  add(payload: any) {
    return this.http.post(`${this.baseUrl}/add`, payload);
  }

  subtract(payload: any) {
    return this.http.post(`${this.baseUrl}/subtract`, payload);
  }

  divide(payload: any) {
    return this.http.post(`${this.baseUrl}/divide`, payload);
  }

  // Uses Interceptor to prove we are logged in
  getHistory() {
    return this.http.get(`${this.baseUrl}/getHistory`);
  }

  deleteById(id: number) {
    return this.http.delete(`${this.baseUrl}/deleteById?id=${id}`, { responseType: 'text' });
  }

  deleteAll() {
    return this.http.delete(`${this.baseUrl}/deleteAll`, { responseType: 'text' });
  }
}
