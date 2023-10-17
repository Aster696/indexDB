import { Component, OnInit } from '@angular/core';
import { ApiService } from './service/http-service';
import { IndexedDbService } from './service/index-db-server';
import { NetworkStatusService } from './service/network-checker-service';
import { GlobalService } from './service/global.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Router } from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'pwa-offline-data-handling';

  isCollapsed: boolean = false

  constructor(
    public global: GlobalService,
    private modal: NzModalService, 
    private http: ApiService,
    private message: NzMessageService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  quickViewToggle(): void {
    // this.quickViewVisible = !this.quickViewVisible;
    this.modal.confirm({
        nzTitle: 'Are you sure ',  /*+ this.party_name + '?'*/
        nzContent: 'You want to logout',
        nzOkText: 'Yes, Logout',
        nzOkType: 'primary',
        nzOkDanger: true,
        nzOnOk: () => this.onClickLogOut(),
        nzCancelText: 'No',
        nzOnCancel: () => this.modal.closeAll()
    });
  }

  onClickLogOut(){
    this.http.logout().subscribe((res : any)=>{
    if(res.success){
        this.message.success(res.message);
        this.modal.closeAll()
        this.router.navigate(['/authentication/login']);
        localStorage.clear()
        this.global.logout = false
      }
    })
  }

}
