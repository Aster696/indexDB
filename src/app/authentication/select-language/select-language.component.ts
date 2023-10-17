import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-select-language',
  templateUrl: './select-language.component.html',
  styleUrls: ['./select-language.component.css']
})
export class SelectLanguageComponent implements OnInit {
  radioValue :any
  constructor() { }

  ngOnInit(): void {
    this.radioValue = localStorage.getItem('appLanguage') || 'en'
  }

  setLanguage(type){
    localStorage.setItem('appLanguage',type)
  }
}
