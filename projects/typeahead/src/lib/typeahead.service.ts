import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
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

  isEnterKey(event: KeyboardEvent): boolean {
    return event.keyCode === Key.Enter;
  }

  isEscapeKey(event: KeyboardEvent): boolean {
    return event.keyCode === Key.Escape;
  }

  // getCountries(): Observable<Array<string>> {
  //   return this.http.get<Array<string>>('../../../../src/assets/countries.json').pipe(
  //     map(data => {
  //       return data['countries'];
  //     })
  //   );
  // }
}
