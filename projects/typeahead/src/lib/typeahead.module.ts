import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { TypeaheadComponent } from './typeahead.component';
import { TypeaheadDirective } from './typeahead.directive';

@NgModule({
  imports: [HttpClientModule],
  declarations: [TypeaheadComponent, TypeaheadDirective],
  exports: [TypeaheadComponent, TypeaheadDirective]
})
export class TypeaheadModule {}
