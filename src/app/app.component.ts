import { Component, OnInit } from '@angular/core';
import { ApiService } from './service/http-service';
import { IndexedDbService } from './service/index-db-server';
import { NetworkStatusService } from './service/network-checker-service';
import { GlobalService } from './service/global.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'pwa-offline-data-handling';

  isCollapsed: boolean = false

  constructor(
    public global: GlobalService
  ) { }

  ngOnInit(): void {
    
  }
}
