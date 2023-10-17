import { Injectable } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { ApiService } from './http-service';
import * as CryptoJS from 'crypto-js';
import { saveAs } from "file-saver";
import * as XLSX from 'xlsx';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  params:any

  zoneData: any = []
  districtData: any = []
  assemblyData: any = []
  candidateData: any = []
  loksabhaList: any = []
  enrollerData: any = []
  debounce: any
  api_call_loader: any = { 'selectLoader': false }

  userData: any = JSON.parse(localStorage.getItem('iyc_user_data'))
  globalUser: any = JSON.parse(localStorage.getItem('global_account_data'))
  domainUser: any = JSON.parse(localStorage.getItem('domain_user'))
  language: any = localStorage.getItem('appLanguage')

  query_params: any

  // Current App Nav;
  public globalNavValue = new BehaviorSubject<any>('');
  public global_error_link = new BehaviorSubject<any>('');


  globalUserPermissionsData = new ReplaySubject<any>();
  constructor(public message: NzMessageService, public http: ApiService) {
    this.getLocation()
   }

  public globalUserData = new ReplaySubject<any>();
  public globalAccountData = new ReplaySubject<any>();

  async getFromCache(url: string): Promise<Response | null> {
    try {
      const cache = await caches.open('api-call');
      const response = await cache.match(url);
      return response;
    } catch (error) {
      console.error('Cache retrieval error:', error);
      return null;
    }
  }

  async getCacheNames(): Promise<string[]> {
    const cacheNames = await caches.keys();
    return cacheNames;
  }

  sendUserData(data: any) {
    this.globalUserData.next(data);
  }

  public setErrorLink(url){
    this.global_error_link.next(url)
  }

  public setPermissionValue(data): any {
    this.globalUserPermissionsData.next(data);
  }

  sendGlobalAccountData(data: any) {
    this.globalAccountData.next(data);
  }

  setCurrNavValue(data){
    this.globalNavValue.next(data)
  }

  getUserDetails() {
    this.http
    .getUserDetails()
    .subscribe(
      (res: any) => {
        if(res?.success) {
          localStorage.setItem("iyc_user_data", JSON.stringify(res));
          this.userData = JSON.parse(localStorage.getItem('iyc_user_data'))
          localStorage.setItem('appLanguage', this?.userData?.data?.language?.key)
        }
      }
    )
  }

  getSubDomain(sub){
    // let data = {'account_code' : sub}; 
    let data = {'account_code' : sub}; 
    this.http.getSubDomainData(data).subscribe(
      (res:any)=>{
        if(res.success){
          this.domainUser = res?.data
          localStorage.setItem('domain_user', JSON.stringify(this.domainUser))
          // console.log('user')
        }else{
          localStorage.setItem('domain_user', 'false')
          // this.router.navigate(['/error-1'])
        }
      }, (error: any) => {
        localStorage.setItem('domain_user', 'false')
      }
    )
  }

  getDeviceType() {
    var mq = window.matchMedia("(max-width: 720px)");
    if (mq.matches) {
      return 'mobile';
    }
    else {
      return 'desktop';
    }
  }

  amountFromatterFunctionForHO(value) {
    var val: any
    val = Math.abs(value)
    if (val >= 10000000) {
      val = (val / 10000000).toFixed(2) + (' Cr');
    } else if (val >= 100000) {
      val = (val / 100000).toFixed(2) + (' Lacs');
    } else if (val >= 1000) {
      val = (val / 1000).toFixed(2) + (' Thousand');
    }
    if (typeof val == 'string') {
    } else {
      val = val.toFixed(2)
    }
    return val;
  }

  checkBrowserType() {
    if ((navigator.userAgent.indexOf("Opera") || navigator.userAgent.indexOf('OPR')) != -1) {
      return 'Opera'
    } else if (navigator.userAgent.indexOf("Chrome") != -1) {
      return 'Chrome'
    } else if (navigator.userAgent.indexOf("Safari") != -1) {
      return 'Safari'
    } else if (navigator.userAgent.indexOf("Firefox") != -1) {
      return 'Firefox'
    } else {
      return 'IE'
    }
  }

  // export(type) {
  //   const generateloader = this.message.loading('Generating File..', { nzDuration: 0 }).messageId;
  //   this.http.exportMaster(type).subscribe((res: any) => {
  //     if (res.size > 41) {
  //       this.message.success('File Exported');
  //       this.downloadFile(type, res);
  //     } else {
  //       this.message.error("No Report to download");
  //     }
  //     this.message.remove(generateloader);
  //     var downloadURL = window.URL.createObjectURL(res);
  //     var link = document.createElement('a');
  //     link.href = downloadURL;
  //     link.download = '' + '.' + '';
  //     link.click();
  //   }, error => {
  //     this.message.remove(generateloader);
  //   })
  // }

  // exportMasterAPI(type,data ) {
  //   const generateloader = this.message.loading('Generating File..', { nzDuration: 0 }).messageId;
  //   this.http.exportMasterAPIWithMultipleFilters(data).subscribe((res: any) => {
  //     this.message.remove(generateloader);
  //     var downloadURL = window.URL.createObjectURL(res);
  //     var link = document.createElement('a');
  //     link.href = downloadURL;
  //     link.download = '' + '.' + '';
  //     link.click();
  //   }, error => {
  //     this.message.remove(generateloader);
  //   })
  // }

  public downloadFile(type, data) {
    saveAs(data, `${type}.xlsx`);
  }

  searchStaticDataGlobalFunction(type, user, event, isEvent?, candidate_id?) {
    this.api_call_loader['selectLoader'] = true
    clearTimeout(this.debounce);
    this.debounce = setTimeout(() => {
      let search_param = {
        "search_param": (isEvent == 'string' ? event : event.target.value),
        "page": 1,
        "limit": 10
      }
      if (user == 'user') {
        this.globalMasterUser(type, search_param, candidate_id)
      } else if (user == 'master') {
        this.globalMasterFilter(type, search_param)
      }
    }, 500);
  }


  globalMasterFilter(type, search_param?) {
    // let temp = this.globalEncryptionFunction(search_param)
    this.api_call_loader['selectLoader'] = true
    this.http.getGlobalMaster(type, search_param).subscribe((res: any) => {
      if (res?.success) {
        this.api_call_loader['selectLoader'] = false
        if (type == 'ZoneMaster') {
          this.zoneData = res?.data
        } else if (type == 'District') {
          this.districtData = res?.data
        } else if (type == 'Assembly') {
          // this.assemblyData
          this.assemblyData = res?.data
          console.log(this.assemblyData);

        } else if (type == 'LoksabhaMaster') {
          this.loksabhaList = res?.data
        }
      } else {
        this.api_call_loader['selectLoader'] = false
        // this.message.error(res?.message)
      }
    })
  }

  globalMasterUser(type, search_param?, candidate_id?) {
    console.log(candidate_id, 'this is candidate id')
    // let temp = this.globalEncryptionFunction(search_param)
    if (candidate_id) {
      if (!search_param) {
        search_param = { "user_type": candidate_id }
      } else {
        search_param['user_type'] = candidate_id
      }
    }
    this.http.getGlobalUser(type, search_param).subscribe((res: any) => {
      // return res?.data
      if (res?.success) {
        if (type == 'Candidate') {
          this.candidateData = res?.data
        } else if (type == 'Enroller') {
          this.enrollerData = res?.data
        }
      }
    })
  }

  globalEncryptionFunction(data) {
    data = JSON.stringify(data)
    var key = "JDKWIFKDOWR29201KFOW92028FUDISO2"
    key = CryptoJS.enc.Utf8.parse(key);
    var iv = CryptoJS.lib.WordArray.random(16);
    var encrypted = CryptoJS.AES.encrypt(data, key, {
      iv: iv
    });
    var encrypted_data = iv.concat(encrypted.ciphertext).toString(CryptoJS.enc.Base64);
    var final_data = {
      "enrypted_data": encrypted_data
    }
    return final_data
  }


  globalDecryptFunction(encrypted_data) {
    var key = "JDKWIFKDOWR29201KFOW92028FUDISO2"
    key = CryptoJS.enc.Utf8.parse(key);

    var ciphertext = CryptoJS.enc.Base64.parse(encrypted_data);

    // split IV and ciphertext
    var iv = ciphertext.clone();
    iv.sigBytes = 16;
    iv.clamp();
    ciphertext.words.splice(0, 4); // delete 4 words = 16 bytes
    ciphertext.sigBytes -= 16;

    // decryption
    var decrypted = CryptoJS.AES.decrypt({ ciphertext: ciphertext }, key, {
      iv: iv
    });

    var decrypted_data = decrypted.toString(CryptoJS.enc.Utf8);
    return decrypted_data
  }

  numberWithCommas(data) {
    return data.toString().split('.')[0].length > 3 ? data.toString().substring(0, data.toString().split('.')[0].length - 3).replace(/\B(?=(\d{2})+(?!\d))/g, ",") + "," + data.toString().substring(data.toString().split('.')[0].length - 3) : data.toString();
  }



  exportTableData(data, filename, column_name) {
    console.log(filename, "file to download")
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, filename + '.xlsx');
  }

  exportPDF(downloadText: string, id?: any, orientation?: any, format?: any) {
    // make sure you add id="doc" in your main tag
    // use this code in template tags to exclude specific section in html: data-html2canvas-ignore="true"
    html2canvas(document.getElementById('doc')).then((canvas) => {
      let imgData = canvas.toDataURL('image/png');
      let imgHeight = canvas.height * 208 / canvas.width;
      let doc = new jsPDF({ orientation, format });
  
      doc.addImage(imgData, 0, 0, 208, imgHeight);
      const pdfBlob = doc.output('blob');
    let pdfUrl: any
    pdfUrl = URL.createObjectURL(pdfBlob);
    // Open a new window/tab to display the PDF
    const pdfWindow = window.open(pdfUrl, '_blank');
    // If the new tab/window doesn't open, provide a message to the user
    if (!pdfWindow) {
      this.message.info('Please allow pop-ups to view the PDF.');
    }
    }).catch((error) => {
      // console.log(error)
    });
  }

  createCustomePDF(PDF_data: any, pageSize?: any) {
    let pdf: any = new jsPDF({
      format: [pageSize, pageSize]
    });

    const fontPath = 'assets/fonts/TiroDevanagariHindi-Regular.ttf';
    try {
      pdf.addFileToVFS('TiroDevanagariHindi-Regular.ttf', fontPath);
      pdf.addFont('TiroDevanagariHindi-Regular.ttf', 'TiroDevanagariHindi-Regular', 'normal');
      pdf.setFont('TiroDevanagariHindi-Regular');
  
    } catch (error) {
      console.error('Error loading font:', error);
    }
    pdf.text(PDF_data.header, 15, 10)
    
    pdf.autoTable({
      head: [PDF_data?.headers],
      body: PDF_data?.data,
      margin: { top: 15 },
    })
    pdf.save(PDF_data.download_text)
  }

  print() {
    window.print()
  }

  // get user location
  location: any
  error: string;
  getLocation() {
    // device_details
    let navigator = window.navigator;
    const mobileKeywords = [
      'Mobile',
      'Android',
      'iPhone',
      'iPad',
      'Windows Phone',
      'BlackBerry',
    ];
  
    // Check if the userAgent string contains any of the mobile keywords
    let data = {
      app_code: navigator?.appCodeName,
      app_name: navigator?.appName,
      app_version: navigator?.appVersion,
      platform: navigator?.platform,
      user_agent: navigator?.userAgent,
      user_agent_data: {
        mobile: mobileKeywords.some(keyword => navigator.userAgent.includes(keyword)),
        platform: navigator?.platform
      },
      location: {
        latitude: 0.0, 
        longitude: 0.0
      }
    }
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {

          data.location.latitude = position.coords.latitude;
          data.location.longitude = position.coords.longitude;
          this.location = data
        },
        (error) => {
          this.error = error.message;
          console.error('Error getting location:', error);
        }
      );
    } else {
      this.error = 'Geolocation is not supported by your browser.';
      console.error('Geolocation is not supported by your browser.');
    }
    // console.log(data)
    // return data;
    this.location = data
  }
}
