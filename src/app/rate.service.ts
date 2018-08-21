import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';


import { Rate } from './rate';
import { HttpErrorHandler, HandleError } from './http-error-handler.service';

const _apiUrl = 'https://testapi-converter.herokuapp.com/';
const _pclender = 'https://www.dev.pclender.com/pclender/demo/post_demo.php';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-type': 'application/x-www-form-urlencoded'
  })
};

@Injectable({
  providedIn: 'root'
})
export class RateService {

  private handleError: HandleError;

  constructor(
    private http: HttpClient,
    httpErrorHandler: HttpErrorHandler) {
    this.handleError = httpErrorHandler.createHandleError('RateService');
  }

  updateRates(): Observable<any> {
    return this.http.get(`${_apiUrl}rates`);
  }

  convertCurrency(request): Observable<Rate> {
    const body = new HttpParams()
    .set('date', request.date)
    .set('usd', request.usd)
    .set('targetCurrency', request.targetCurrency);

    return this.http.post<Rate>(`${_apiUrl}rates`, body, httpOptions)
      .pipe(
        catchError(this.handleError('convertCurrency', request))
      );
  }

  //submitResponse(request) {
  //  return this.http.post(`${_pclender}`, request, httpOptions)
  //    .pipe(
  //      catchError(this.handleError('convertCurrency', request))
  //    );
  //}

  init() {
    return this.http.get<any>(_apiUrl);
  }
}
