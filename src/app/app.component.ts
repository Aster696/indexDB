import { Component } from '@angular/core';
import { ApiService } from './service/http-service';
import { IndexedDbService } from './service/index-db-server';
import { NetworkStatusService } from './service/network-checker-service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'pwa-offline-data-handling';

  isCollapsed: boolean = false
}
