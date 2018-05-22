import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { AppService } from './app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(private appService: AppService) {}

  country = new FormControl('');
  countries: Array<string> = [];

  ngOnInit() {
    this.appService.getCountries().subscribe(data => (this.countries = data));
  }

  getFilteredSuggestions(dataLst: Array<string>) {
    console.log('datalst', dataLst);
    this.countries = [...dataLst];
  }
}
