import { Directive, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Observable, Subscription, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map, switchMap } from 'rxjs/operators';
import { TypeaheadService } from './typeahead.service';

@Directive({
  selector: '[typeahead]'
})
export class TypeaheadDirective implements OnInit, OnDestroy {
  @Input() delayTime = 400;
  @Input() apiURL: string;
  @Input() urlParams: object = {};
  @Input() urlQueryParam = 'query';
  @Input() apiMethod = 'get';
  @Input() apiType = 'http';
  @Input() dataList: Array<any> = [];
  @Input() callbackFuncName: string;
  @Output() filteredDataList = new EventEmitter<Array<string>>();

  keyUpSub: Subscription;

  constructor(private typeAheadService: TypeaheadService) {}

  @HostListener('keydown', ['$event'])
  handleEsc(event: KeyboardEvent) {
    if (this.typeAheadService.isEscapeKey(event)) {
      event.preventDefault();
    }
    console.log('keydown event', event);
    this.typeAheadService.updateKeyDownValue(event);
  }

  @HostListener('keyup', ['$event'])
  onkeyup(event: KeyboardEvent) {
    event.preventDefault();
    event.stopPropagation();
    console.log('keyup event', event);
    this.typeAheadService.updateKeyUpValue(event);
  }

  ngOnInit() {
    this.showDataList();
  }

  showDataList() {
    this.keyUpSub = this.typeAheadService.onKeyUp$
      .pipe(
        filter((e: KeyboardEvent) => this.typeAheadService.validateNonCharKeyCode(e.keyCode)),
        map(this.extractFormValue),
        filter(this.emptyString),
        debounceTime(this.delayTime),
        distinctUntilChanged(),
        switchMap((searchTerm: string): Observable<Array<string>> => of(['United States']))
        // switchMap((searchTerm: string): Observable<Array<any>> => this.filterData(searchTerm))
      )
      .subscribe((filteredList: Array<string>) => {
        console.log(filteredList);
        this.filteredDataList.emit(filteredList);
      });
  }

  ngOnDestroy() {
    this.keyUpSub.unsubscribe();
  }

  private filterData(searchTerm: string): Observable<Array<any>> {
    return this.dataList.length
      ? this.filterListSource(this.dataList, searchTerm)
      : this.typeAheadService.makeApiRequest(
          searchTerm,
          this.apiURL,
          this.urlQueryParam,
          this.urlParams,
          this.apiMethod,
          this.apiType,
          this.callbackFuncName
        );
  }

  private filterListSource(list: Array<any>, query: string): Observable<Array<string>> {
    return of(list.filter((item: string) => item.includes(query)));
  }

  /**
   * Extract the characters typed in the input of the typeahead component.
   */
  private extractFormValue(event: KeyboardEvent): string {
    return event['target']['value'];
  }

  private emptyString(inputSearchTerm: string): boolean {
    return inputSearchTerm.length > 0;
  }
}
