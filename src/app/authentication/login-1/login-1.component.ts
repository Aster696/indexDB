import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { NzMessageService } from "ng-zorro-antd/message";
import { timer } from "rxjs";
import { take, map } from "rxjs/operators";
import { GlobalService } from "src/app/service/global.service";
import { ApiService } from "src/app/service/http-service";
// import * as timer from 'rxjs';

@Component({
  templateUrl: "./login-1.component.html",
})
export class Login1Component {
  loginForm: FormGroup;
  modalHeadingTitle = "Terms of service";
  termConditionModal: boolean = false;
  _currentSection = "loginForm";
  isStockistCode: boolean = false;
  otpBoxValue = "";
  _apiCallLoader = {
    loginloader: false,
    verifyOTP: false,
  };

  
  count_value = 60;
  realCountertimer: any;
  firebaseFCMTokenValue = "";
  formatedMobileString: any;
  stockistCode: any;

  constructor(
    private globalFunction: GlobalService,
    private fb: FormBuilder,
    private HttpService: ApiService,
    private message: NzMessageService,
    private router: Router,
    private active_route: ActivatedRoute,
  ) { }
  _currentLanguage: any
  loginPageContext = {
    header: {
      mlaName: '', greeting: '', subHeading: ''
    },
    login: { title: '', subtitle: '', placeholder_mob: '', mob_error: '', placeholder_name: '', name_error: '' },
    btn: { btn1: '', btn2: '' },
    otp: { title: '', subtitle: '', resendOtp: '', btnOtp: '', btnSubText: '' },
    successScreen: ''
  }

  subDomainName : any;
  ngOnInit(): void {
    // let url = window.location.href;
    let url = "https://northr.chatiyc.com/"
    this.subDomainName = url.split('.');
    this.getSubDomain(this.subDomainName[0].replace(/^https:\/\//, ''));
    // console.log(this.active_route.snapshot.firstChild.url[0].path);
    if (localStorage.getItem('appLanguage')) {
      this._currentLanguage = localStorage.getItem('appLanguage');
    } else {
      this._currentLanguage = 'hi';
      localStorage.setItem('appLanguage', 'hi')
    }
    if (this._currentLanguage == 'en') {
      this.loginPageContext = {
        header: {
          mlaName: 'MLA Devendra Yadav', greeting: 'Hello', subHeading: "Let's get started"
        },
        login:
        {
          title: 'Please login to continue', subtitle: 'We will send you a One Time Password on this mobile number',
          placeholder_mob: 'Enter your Mobile Number', mob_error: 'Please input your Mobile Number!',
          placeholder_name: 'Enter your Full Name', name_error: ''
        },
        btn: { btn1: 'Get OTP', btn2: '' },
        otp: {
          title: 'Enter Verification Code', subtitle: 'Type the 6-digit verification code sent on your registered Mobile associated with code',
          btnOtp: 'Verify', btnSubText: 'Didn’t receive an OTP?', resendOtp: 'Resend OTP'
        },
        successScreen: 'Your Mobile number has been successfully verified'
      }
    } else {
      this.loginPageContext = {
        header: {
          mlaName: 'MLA Devendra Yadav', greeting: 'नमस्ते', subHeading: "आएँ शुरू करें"
        },
        login:
        {
          title: 'जारी रखने के लिए कृपया लॉगिन करें', subtitle: 'हम आपको इस मोबाइल नंबर पर एक वन टाइम पासवर्ड भेजेंगे',
          placeholder_mob: 'अपना मोबाइल संख्या दर्ज करे', mob_error: 'कृपया अपना मोबाइल नंबर डालें!',
          placeholder_name: 'अपना पूरा नाम भरें', name_error: 'कृपया पूरा नाम दर्ज करें'
        },
        btn: { btn1: 'ओटीपी प्राप्त करें', btn2: '' },
        otp: { title: 'सत्यापन कोड दर्ज करें', subtitle: 'कोड से जुड़े अपने पंजीकृत मोबाइल पर भेजा गया 6 अंकों का सत्यापन कोड टाइप करें', resendOtp: 'ओटीपी पुनः भेजें', btnOtp: 'सत्यापित करना', btnSubText: 'क्या आपको ओटीपी नहीं मिला?' },
        successScreen: 'आपका मोबाइल नंबर हो गया है सफलतापूर्वक सत्यापित'
      }
    }

    this.loginForm = this.fb.group({
      mobile_prefix: ['India', [Validators.required]],
      mobile: [null, [Validators.required, Validators.pattern('^[A-Z]{2}[0-9]{4}$')]],
      full_name: ['', [Validators.required, Validators.minLength(3)]]
    });

    this.loginForm.controls['mobile'].valueChanges.subscribe(value => {
      // console.log(value)
      let isnum = /^[A-Z]{2}/.test(value);
      if (isnum) {
        this.loginForm.get('mobile').setValidators([Validators.required, Validators.pattern('^[A-Z]{2}[0-9]{4}$')]);
        this.loginForm.get('mobile').updateValueAndValidity({ emitEvent: false });
        this.isStockistCode = true
      } else {
        this.loginForm.get('mobile').setValidators([Validators.required, Validators.pattern('^[6-9][0-9]{9}$')]);
        this.loginForm.get('mobile').updateValueAndValidity({ emitEvent: false });
        this.isStockistCode = false
      }
    });
    if (localStorage.getItem('iyc_user_data')) {
      this.VerifyUserFunction()
    }
  }

  domain_user: any
  getSubDomain(sub){
    // let data = {'account_code' : sub}; 
    let data = {'account_code' : sub}; 
    this.HttpService.getSubDomainData(data).subscribe(
      (res:any)=>{
        if(res.success){
          this.domain_user = res?.data
          localStorage.setItem('domain_user', JSON.stringify(this.domain_user))
          // console.log('user')
        }else{
          localStorage.setItem('domain_user', 'false')
          // this.router.navigate(['/error-1'])
        }
      }, (error: any) => {
        localStorage.setItem('domain_user', 'false')
        this.router.navigate(['/authentication/error-1'])
      }
    )
  }

  submitForm(form): void {
    for (const i in this.loginForm.controls) {
      this.loginForm.controls[i].markAsDirty();
      this.loginForm.controls[i].updateValueAndValidity();
    }
    if (this.loginForm.valid) {
      this.sendOTPAPIFunction(form);
    }
  }

  sendOTPAPIFunction(form) {
    let data = new FormData();
    this.formatedMobileString = this.loginForm.value.mobile.replace(
      /.(?=.{2})/g,
      "X"
    );
    data.append("mobile", form.value.mobile);
    data.append("name", form.value.full_name);
    this._apiCallLoader["loginloader"] = true;
    var end_point = "/users/v1/auth/send-otp";
    this.HttpService.UserLoginSendOTP(data, end_point).subscribe((res) => {
      this.setTimerFromStart();
      this._apiCallLoader['loginloader'] = false
      if (res.success) {
        this.message.success(res.message)
        this._currentSection = 'OTPVerification'
      }
    }, (err) => {
      this._apiCallLoader['loginloader'] = false
    })
  }

  VerifyUserFunction() {
    var end_point = '/users/v1/auth/verify-user';
    var device_type = this.globalFunction.checkBrowserType();
    let data = new FormData();
    console.log('In checkusr log');

    this.HttpService.verifyUserAPI(end_point).subscribe(
      (res) => {
        if (res.success) {
          this.globalFunction.sendUserData(res);
          console.log('In checkusr log');

          localStorage.setItem("iyc_user_data", JSON.stringify(res.data));
          this.globalFunction.userData = JSON.parse(localStorage.getItem('iyc_user_data'))
          localStorage.setItem('appLanguage', this.globalFunction?.userData?.data?.language?.key)
          this.checkUserLoggedInOrNot(res);
          this.changeIcon()
        }
      },
      (err) => {
        localStorage.getItem('domain_user') !== 'false' ? this.router.navigate(["/authentication/login"]) : null;
        // localStorage.removeItem("iyc_user_data");
        // localStorage.removeItem("iyc_user_token");
        // localStorage.removeItem('appLanguage')
        // localStorage.removeItem('menuItem')
      }
    );
  }

  changeIcon() {
    // Use JavaScript to update the manifest file
    const link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
    link.href = this.globalFunction.userData?.account_logo; // Change to the new icon
  }

  ifTokenAuthorized: boolean = false;
  checkUserLoggedInOrNot(res?) {
    this.ifTokenAuthorized = false
    if (localStorage.getItem('iyc_user_token')) {
      console.log('In checkusr log');

      if (localStorage.getItem('iyc_user_data')) {
        // console.log('In checkusr log');
        if(res.data?.user_type?.name) {
          this.ifTokenAuthorized = true
          setTimeout(() => {
            this.ifTokenAuthorized = false;
            this.router.navigate(["/"]);
          }, 6000);
        }else {
          this.message.error("You don't have permission to access this panel. Kindly contact tech support")
        }

        // if (res.data?.user_type?.name == 'Superuser') {
        //   this.ifTokenAuthorized = true
        //   setTimeout(() => {
        //     this.ifTokenAuthorized = false;
        //     this.router.navigate(["/voter"]);
        //   }, 6000);

        // } else if (res.data?.user_type?.name == 'Data Operator' || res.data?.user_type?.name == 'Supervisor') {
        //   this.router.navigate(["/data-operator/home"]);
        // } else if (res.data?.user_type?.name == 'Account Manager') {
        //   this.router.navigate(["/accounts/vouchers"]);
        // }
      }
    }
  }

  verifyOTPFunction(form) {
    if (this.otpBoxValue.length < 6) {
      this.message.error("Please enter 6 digit OTP");
      return;
    }
    let data = new FormData();
    data.append("mobile", form.value.mobile);
    var device_type = this.globalFunction.checkBrowserType();
    data.append("otp", this.otpBoxValue);
    this._apiCallLoader["verifyOTP"] = true;
    var end_point = "/users/v1/auth/verify-otp";
    this.HttpService.verifyOTPAPI(data, end_point).subscribe(
      (res) => {
        this._apiCallLoader["verifyOTP"] = false;
        if (res.success) {
          this.message.success(res.message);
          localStorage.setItem("iyc_user_token", res.token);
          localStorage.setItem("iyc_user_data", JSON.stringify(res));
          setTimeout(() => {
            var permissions = res.permissions
            permissions.push('');
            // this.permissionsService.loadPermissions(permissions);

            if(res.data?.user_type?.name) {
              this.router.navigate(["/voter"]);
            }else {
              this.message.error("You don't have permission to access this panel. Kindly contact tech support")
            }
            // if (res.data?.user_type?.name == 'Superuser') {
            //   this.router.navigate(["/voter"]);
            //   // this.router.navigate(["/dashboard/home"]);
            // } else if (res.data?.user_type?.name == 'Data Operator' || res.data?.user_type?.name == 'Supervisor') {
            //   this.router.navigate(["/data-operator/home"]);
            // }
            // else if (res.data?.user_type?.name == 'Account Manager') {
            //   this.router.navigate(["/accounts/vouchers"]);
            // }
          }, 0);
        }
      },
      (err) => {
        this._apiCallLoader["verifyOTP"] = false;
      }
    );
  }

  // on OTP input
  onInputChange(event) {
    this.otpBoxValue = event;
  }

  handleCancel() {
    this.termConditionModal = false;
  }

  // setTimer
  setTimerFromStart() {
    this.count_value = 60;
    timer(0, 1000)
      .pipe(
        take(this.count_value),
        map(() => --this.count_value)
      )
      .subscribe((value) => {
        this.realCountertimer = value;
      });
  }

  public findInvalidControls() {
    const invalid = [];
    const controls = this.loginForm.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    let temp = invalid.length > 1
    return temp;
  }
}
