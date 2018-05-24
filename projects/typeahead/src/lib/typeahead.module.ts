import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { TypeaheadDirective } from './typeahead.directive';

@NgModule({
  imports: [HttpClientModule],
  declarations: [TypeaheadDirective],
  exports: [TypeaheadDirective]
})
export class TypeaheadModule {}
