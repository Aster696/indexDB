import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { GlobalService } from 'src/app/service/global.service';

@Component({
  templateUrl: './error-1.component.html'
})

export class Error1Component implements OnInit {
  _currUrl: any;

  constructor(private router: Router, private global: GlobalService, private message: NzMessageService) {
    if (!JSON.parse(localStorage.getItem('iyc_user_data')) && localStorage.getItem('domain_user') !== 'false') {
      this.router.navigate(["/authentication/login"]);
    }
  }


  ngOnInit(): void {
    this.global.global_error_link.subscribe((res:any)=>{
      if(res){
        this._currUrl = res;
        // console.log("==>>>",res)
      }
    })
  }



  onClickRedirectToAssignedRouter() {
    let res = JSON.parse(localStorage.getItem('iyc_user_data'))

    // if(!JSON.parse(localStorage.getItem('iyc_user_data')){
    //     this.router.navigate(["/authentication/login"]);
    // }
    // console.log(res?.permissions.length == 0);
    if (res?.permissions.length == 0) {
      // localStorage.removeItem("iyc_user_data");
      res = null;
      // this.router.navigate(["/authentication/login"]);
      // return;
    }
    if (!res && localStorage.getItem('domain_user') !== 'false') {
      this.router.navigate(["/authentication/login"]);
      return;
    }
    console.log(this._currUrl);
    
    // if (res.data?.user_type?.name == 'Superuser') {
    //   this.router.navigate(["/voter"]);
    // } else if (res.data?.user_type?.name == 'Data Operator') {
    //   this.router.navigate(["/voter"]);
    // } else if (res.data?.user_type?.name == 'Account Manager') {
    //   this.router.navigate(["/accounts/vouchers"]);
    // } else {
    //   localStorage.getItem('domain_user') !== 'false' ? this.router.navigate(["/authentication/login"]) : null;
    // }

    if(res.data?.user_type?.name) {
      this.router.navigate(["/voter"]);
    }else {
      localStorage.getItem('domain_user') !== 'false' ? this.router.navigate(["/authentication/login"]) : null;
      this.message.error("You don't have permission to access this panel. Kindly contact tech support")
    }
  }
}    