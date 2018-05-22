import { Directive, HostListener, OnInit, Output, EventEmitter } from '@angular/core';
import { Observable, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, switchMap } from 'rxjs/operators';
import { TypeaheadService } from './typeahead.service';

@Directive({
  selector: '[typeahead]'
})
export class TypeaheadDirective implements OnInit {
  @Output() result = new EventEmitter<Array<string>>();
  constructor(private typeAheadService: TypeaheadService) {
    // this.typeAheadService.onKeyUp$.subscribe((event: KeyboardEvent) => this.showDataList(event));
  }

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
    // this.typeAheadService.onKeyUp$.subscribe(data => console.log('Event', data));
    this.typeAheadService.onKeyUp$
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        map(event => event['target']['value']),
        switchMap((searchTerm: string): Observable<Array<string>> => of(['United States']))
      )
      .subscribe(data => {
        console.log(data);
        this.result.emit(data);
      });
  }
}
