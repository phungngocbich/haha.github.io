import { CommonModule } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { catchError, Observable, retry, throwError } from 'rxjs';

@Component({
  selector: 'app-service',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './service.component.html',
  styleUrl: './service.component.css'
})
export class ServiceComponent {
  myAPIurl: string="http://localhost:3000" 


  constructor(private _http: HttpClient) { }
  getAllProducts(): Observable<any> {
    return this._http
    .get<any>(`${this.myAPIurl}/products`)
    .pipe(retry(2), catchError(this.handleErro));
  }
  handleErro(err: HttpErrorResponse){
    return throwError(() => new Error(err.message))
  }

}
