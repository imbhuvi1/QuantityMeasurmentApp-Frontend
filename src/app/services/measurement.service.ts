import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MeasurementService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:8080/api/quantity';

  compare(data: any) {
    return this.http.post(`${this.baseUrl}/compare`, data);
  }

  convert(data: any) {
    return this.http.post(`${this.baseUrl}/convert`, data);
  }

  add(data: any) {
    return this.http.post(`${this.baseUrl}/add`, data);
  }

  subtract(data: any) {
    return this.http.post(`${this.baseUrl}/subtract`, data);
  }

  divide(data: any) {
    return this.http.post(`${this.baseUrl}/divide`, data);
  }

  // Uses Interceptor to prove we are logged in
  getHistory() {
    return this.http.get(`${this.baseUrl}/getHistory`);
  }

  deleteById(id: number) {
    return this.http.delete(`${this.baseUrl}/deleteById?id=${id}`);
  }

  deleteAll() {
    return this.http.delete(`${this.baseUrl}/deleteAll`);
  }
}
