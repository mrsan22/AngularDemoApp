import { Component, HostListener, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { TypeaheadService } from './typeahead.service';
@Component({
  selector: '[ta-type-ahead]',
  template: ``,
  styles: []
})
export class TypeaheadComponent implements OnInit {
  private keydown$ = new Subject<KeyboardEvent>();
  private keyup$ = new Subject<KeyboardEvent>();

  constructor(private typeAheadService: TypeaheadService) {
    // this.typeAheadService.onKeyUp$.subscribe(data => this.showDataList(data));
  }

  @HostListener('keydown', ['$event'])
  handleEsc(event: KeyboardEvent) {
    if (this.typeAheadService.isEscapeKey(event)) {
      event.preventDefault();
    }
    console.log('keydown event', event);
    // this.keydown$.next(event);
  }

  @HostListener('keyup', ['$event'])
  onkeyup(event: KeyboardEvent) {
    event.preventDefault();
    event.stopPropagation();
    console.log('keyup event', event);
    // this.keyup$.next(event);
    this.typeAheadService.updateKeyUpValue(event);
  }

  ngOnInit() {
    //this.showDataList(this.keyup$);
  }

  showDataList(event) {
    console.log('Event', event);
  }
}
