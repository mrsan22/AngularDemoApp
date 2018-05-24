import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Key } from './typeahead-util';

@Injectable({
  providedIn: 'root'
})
export class TypeaheadService {
  private onKeyUpAction = new Subject<KeyboardEvent>();
  private onKeyDownAction = new Subject<KeyboardEvent>();
  // This variable is an Observable that can be subscribed from any component constructor.
  onKeyUp$: Observable<KeyboardEvent> = this.onKeyUpAction.asObservable();
  onKeyDown$: Observable<KeyboardEvent> = this.onKeyDownAction.asObservable();

  constructor(private http: HttpClient) {}

  /**
   * This method is used to update the value of onKeyupAction subject from any component that injects Typeahead Service.
   * @param event {KeyboardEvent} - on keyup action.
   */
  updateKeyUpValue(event: KeyboardEvent): void {
    this.onKeyUpAction.next(event);
  }

  /**
   * This method is used to update the value of onKeyDownAction subject from any component that injects Typeahead Service.
   * @param event {KeyboardEvent} - on keydown action.
   */
  updateKeyDownValue(event: KeyboardEvent): void {
    this.onKeyDownAction.next(event);
  }

  validateNonCharKeyCode(keyCode: number): boolean {
    return [Key.Enter, Key.Tab, Key.Shift, Key.ArrowLeft, Key.ArrowUp, Key.ArrowRight, Key.ArrowDown].every(
      codeKey => codeKey !== keyCode
    );
  }

  isEscapeKey(event: KeyboardEvent): boolean {
    return event.keyCode === Key.Escape;
  }

  makeApiRequest(
    searchTerm: string,
    apiURL: string,
    urlQueryParam: string,
    urlParams: object,
    apiMethod: string,
    apiType: string,
    callbackFuncName: string
  ): Observable<any> {
    const options = { params: this.configureParams(searchTerm, urlQueryParam, urlParams) };
    const validApiMethod = this.checkApiMethod(apiMethod);
    return apiType === 'http'
      ? this.requestHttpCall(apiURL, validApiMethod, options)
      : this.requestJsonpCall(apiURL, options, callbackFuncName);
  }

  private configureParams(searchTerm: string, urlQueryParam: string, urlParams: object): HttpParams {
    const searchParams = {
      [urlQueryParam]: searchTerm,
      ...urlParams
    };
    let Params = new HttpParams();
    for (const eachKey of Object.keys(searchParams)) {
      Params = Params.append(eachKey, searchParams[eachKey]);
    }
    return Params;
  }

  private checkApiMethod(apiMethod: string): string {
    const validHttpMethods = ['get', 'post', 'put', 'patch', 'delete', 'request'];
    return validHttpMethods.indexOf(apiMethod) !== -1 ? apiMethod : 'get';
  }

  private requestHttpCall(url: string, validApiMethod: string, options: { params: HttpParams }): Observable<any> {
    return this.http[validApiMethod](url, options);
  }

  private requestJsonpCall(
    url: string,
    options: { params: HttpParams },
    callbackFuncName = 'defaultCallback'
  ): Observable<any> {
    const params = options.params.toString();
    return this.http
      .jsonp(`${url}?${params}`, callbackFuncName)
      .pipe(map(this.toJsonpSingleResult), map(this.toJsonpFinalResults));
  }

  private toJsonpSingleResult(response: any) {
    return response[1];
  }

  private toJsonpFinalResults(results: any[]) {
    return results.map((result: any) => result[0]);
  }
}
