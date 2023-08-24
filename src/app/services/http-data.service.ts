import { Injectable } from '@angular/core';
import { environment } from 'environment';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, retry, throwError } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class HttpDataService {
  base_url: string = environment.apiUrl;

  constructor(private http: HttpClient) { }

  //http options
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  //http API Errors
  handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // Default Error Handling
      console.log(
        `An error occurred ${error.status}, body was: ${error.error}`
      );
    } else {
      // Unsuccessful Response Error Code returned from Backend
      console.log(
        `Backend returned code ${error.status}, body was: ${error.error}`
      );
    }
    // Return Observable with Error Message to Client
    return throwError(
      'Something happened with request, please try again later.'
    );
  }

  //Methods to consume API
  getList(): Observable<User[]> {
    return this.http
      .get<User[]>(this.base_url)
      .pipe(retry(2), catchError(this.handleError));
  }

  getUser(id: string): Observable<User> {
    return this.http
      .get<User>(this.base_url + '/' + id)
      .pipe(retry(2), catchError(this.handleError));
  }

  createUser(data: any): Observable<User> {
    return this.http
      .post<User>(this.base_url, JSON.stringify(data), this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }

  updateUser(id: string, data: any): Observable<User> {
    return this.http
      .put<User>(this.base_url + '/' + id, JSON.stringify(data), this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }

}
