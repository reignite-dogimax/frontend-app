import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiClientService {
  constructor(private http: HttpClient) {}

  get<T>(url: string, options?: { headers?: HttpHeaders | { [header: string]: string | string[] }; params?: HttpParams | { [param: string]: string | number | boolean | ReadonlyArray<string | number | boolean> } }): Observable<T> {
    return this.http.get<T>(url, options);
  }

  post<T>(url: string, body: unknown, options?: { headers?: HttpHeaders | { [header: string]: string | string[] } }): Observable<T> {
    return this.http.post<T>(url, body, options);
  }

  patch<T>(url: string, body: unknown, options?: { headers?: HttpHeaders | { [header: string]: string | string[] } }): Observable<T> {
    return this.http.patch<T>(url, body, options);
  }

  delete<T>(url: string, options?: { headers?: HttpHeaders | { [header: string]: string | string[] } }): Observable<T> {
    return this.http.delete<T>(url, options);
  }
}


