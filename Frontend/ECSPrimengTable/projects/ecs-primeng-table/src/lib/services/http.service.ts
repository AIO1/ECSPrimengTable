import { Injectable } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

/**
 * Abstract service for handling HTTP requests for **ECS Primeng table**.
 * 
 * Provides a consistent interface for making GET and POST requests to the backend.
 * Implementations must define how requests are executed, including error handling,
 * headers, and response processing.
 */
@Injectable({ providedIn: 'root' })
export abstract class ECSPrimengTableHttpService {

  /**
   * Performs a GET request to the specified service endpoint.
   * 
   * @template T The expected response type.
   * @param servicePoint The endpoint URL or path for the GET request.
   * @param responseType Optional. The type of response expected, either `'json'` (default) or `'blob'`.
   * @returns An Observable of `HttpResponse<T>`, containing the full HTTP response.
   */
  abstract handleHttpGetRequest<T>(
    servicePoint: string,
    responseType?: 'json' | 'blob'
  ): Observable<HttpResponse<T>>;

  /**
   * Performs a POST request to the specified service endpoint.
   * 
   * @template T The expected response type.
   * @param servicePoint The endpoint URL or path for the POST request.
   * @param data The payload to send in the POST request body.
   * @param httpOptions Optional HTTP headers to include in the request.
   * @param responseType Optional. The type of response expected, either `'json'` (default) or `'blob'`.
   * @returns An Observable of `HttpResponse<T>`, containing the full HTTP response.
   */
  abstract handleHttpPostRequest<T>(
    servicePoint: string,
    data: any,
    httpOptions?: HttpHeaders | null,
    responseType?: 'json' | 'blob'
  ): Observable<HttpResponse<T>>;
}