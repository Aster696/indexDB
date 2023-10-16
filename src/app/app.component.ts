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

  data: any;
  isOnline = false;

  voterList: any = []

  constructor(private http: ApiService, private indexedDbService: IndexedDbService, private networkStatusService: NetworkStatusService) {
    // console.log("ejfewfeweffewf")
  }

  ngOnInit() {
    this.setLocalStorage()
  }

  setLocalStorage() {
    localStorage.setItem('iyc_user_data', JSON.stringify({"success":true,"message":"Client User verified successfully.","data":{"id":8,"first_name":"Aster","last_name":"R - Edited","facebook_link":"https://www.facebook.com/AjitAKukreja","user_type":{"id":1,"name":"Superuser","created_at":"2023-07-12T11:46:01.966659+05:30"},"designation":"Developer","mobile":"9653110552","email":"aster.r@codezen.in","gender":"xxx","date_of_birth":"2000-01-01","whatsapp_number":null,"landline_number":"9653110552","language":{"id":2,"name":"Hindi","key":"hi","created_at":"2023-07-19T11:31:36.794483+05:30"},"booth":[{"id":1,"name":{"en":"1","hi":"1"},"Ward":null,"assembly":{"id":1,"name":{"en":"Bhilai Nagar","hi":"भिलाई नगर"},"city":null,"assembly_code":66,"created_at":"2023-09-02T22:28:46.069626+05:30"},"created_at":"2023-07-14T10:56:37.234682+05:30"},{"id":2,"name":{"en":"2","hi":"2"},"Ward":null,"assembly":{"id":1,"name":{"en":"Bhilai Nagar","hi":"भिलाई नगर"},"city":null,"assembly_code":66,"created_at":"2023-09-02T22:28:46.069626+05:30"},"created_at":"2023-07-14T10:56:37.234772+05:30"},{"id":3,"name":{"en":"3","hi":"3"},"Ward":null,"assembly":{"id":1,"name":{"en":"Bhilai Nagar","hi":"भिलाई नगर"},"city":null,"assembly_code":66,"created_at":"2023-09-02T22:28:46.069626+05:30"},"created_at":"2023-07-14T10:56:37.234810+05:30"},{"id":4,"name":{"en":"4","hi":"4"},"Ward":null,"assembly":{"id":1,"name":{"en":"Bhilai Nagar","hi":"भिलाई नगर"},"city":null,"assembly_code":66,"created_at":"2023-09-02T22:28:46.069626+05:30"},"created_at":"2023-07-14T10:56:37.234845+05:30"},{"id":5,"name":{"en":"5","hi":"5"},"Ward":null,"assembly":{"id":1,"name":{"en":"Bhilai Nagar","hi":"भिलाई नगर"},"city":null,"assembly_code":66,"created_at":"2023-09-02T22:28:46.069626+05:30"},"created_at":"2023-07-14T10:56:37.234877+05:30"},{"id":6,"name":{"en":"6","hi":"6"},"Ward":null,"assembly":{"id":1,"name":{"en":"Bhilai Nagar","hi":"भिलाई नगर"},"city":null,"assembly_code":66,"created_at":"2023-09-02T22:28:46.069626+05:30"},"created_at":"2023-07-14T10:56:37.234908+05:30"},{"id":7,"name":{"en":"7","hi":"7"},"Ward":null,"assembly":{"id":1,"name":{"en":"Bhilai Nagar","hi":"भिलाई नगर"},"city":null,"assembly_code":66,"created_at":"2023-09-02T22:28:46.069626+05:30"},"created_at":"2023-07-14T10:56:37.234940+05:30"},{"id":8,"name":{"en":"8","hi":"8"},"Ward":null,"assembly":{"id":1,"name":{"en":"Bhilai Nagar","hi":"भिलाई नगर"},"city":null,"assembly_code":66,"created_at":"2023-09-02T22:28:46.069626+05:30"},"created_at":"2023-07-14T10:56:37.234972+05:30"},{"id":12,"name":{"en":"12","hi":"12"},"Ward":null,"assembly":{"id":1,"name":{"en":"Bhilai Nagar","hi":"भिलाई नगर"},"city":null,"assembly_code":66,"created_at":"2023-09-02T22:28:46.069626+05:30"},"created_at":"2023-07-14T10:56:37.235097+05:30"},{"id":13,"name":{"en":"13","hi":"13"},"Ward":null,"assembly":{"id":1,"name":{"en":"Bhilai Nagar","hi":"भिलाई नगर"},"city":null,"assembly_code":66,"created_at":"2023-09-02T22:28:46.069626+05:30"},"created_at":"2023-07-14T10:56:37.235129+05:30"}],"sector":[],"ward":[],"zone":[],"date_of_anniversary":null,"status":3,"created_at":"2023-07-27T13:38:13.208728+05:30"},"permissions":["view_dashboard","can_filter_dashboard","view_social_media_link","add_social_media_link","edit_social_media_link","view_voters","add_voters","edit_voters","view_team","add_team","edit_team","view_task","add_task","edit_task","import_task","export_task","booth_level","ward_level","sector_level","street_level"]}))
    localStorage.setItem('appLanguage', 'hi')
    localStorage.setItem('domain_user', JSON.stringify({"name":{"en":"Raipur North","hi":"उत्तर रायपुर"},"account_code":"northr","account_logo":"https://storage.googleapis.com/elections-sm-prod/account_logo/2023/09/15/358447604_826671258834302_7596698321261581591_n.jpg?Expires=1697533283&GoogleAccessId=elections-prod-bucket-access%40forbinary-project.iam.gserviceaccount.com&Signature=sUZrHVlgHP9428rtfOuKLsp4FeUifiyXRw8BFG9hX%2FpTQZHdMR1uiNSoR%2FDjjConj%2FFK5Y9QEgGbRI%2Bw%2B7OxxcWEHbMnIk53Vg1n%2FzgDwlar6vbV66%2FE6kKARQXCgnV0lIXNOBPa1GnN0zqUdqHVdGr9Ek%2FPLFf7wZDmHMpEvd7DF36ogB5NVe6CFFuntmZEZEV%2FFyBpuPw28ArpRWGawsSRP4hNCNHhIxO7iiPEx%2BuSbR2Y6snaFcjc4yR7MBrDC7rqv5NEU7KhePx97ehRbJ0aB6vczyMiBSP8t%2FdtFoyJGg9MxLvE4DvEbj3lgk6DSHiIPg8b%2BVWt7m4XvcLsNg%3D%3D","party_name":{"en":"Congress","hi":"कांग्रेस"},"election_symbol":{"en":"paw","hi":"पंजा"},"candidate_name":{"en":"Ajit Kukreja","hi":"अजीत कुकरेजा"},"party_icon":"https://storage.googleapis.com/elections-sm-prod/party_icon/2023/10/06/Indian_National_Congress_hand_logo.svg.png?Expires=1697533283&GoogleAccessId=elections-prod-bucket-access%40forbinary-project.iam.gserviceaccount.com&Signature=hRtm4iBLTiIQijQXyZiZSBWsRICW7qclZ5%2FqgJhU12dc3UfP6NKYKbjHM1kkCsUm7883jqewtesvS7W0zvPGZznkFvSBcpsLRLfjw3z9v%2BVfeExoqDeSp4pBlXfOE3AWCdoTqC2vdSjdPgyzVpN4j1W%2FMtoMGoP13mRQPQbx38zWE6PwDLzMzGuOMAPeGRTqnenKCgDd6nEHLDGgsn0CqTGlw%2FLziNkplKSvHsjhsScDDJSnwQSnUuQpmKTtwlOEtmXk9GJfZqXKr35w5LeQJ%2BHozwh5gk1RY1bbsUSE97nSgLfJ%2BpP2T%2BJgoDVM6UuQF3CLd%2BfjGNgOUyGNSqMeqA%3D%3D"}))
    localStorage.setItem('iyc_user_token', '0c0f6501d967be429fe7a8cb2123f65779b78869')
    localStorage.setItem('global_account_data', JSON.stringify({"id":3,"name":{"en":"Raipur North","hi":"उत्तर रायपुर"},"designation":{"en":"Politician"},"mobile":"8828349328","email":null,"state":{"id":5,"name":{"en":"Chhattisgarh","hi":"छत्तीसगढ"},"created_at":"2023-07-14T11:00:00.500910+05:30"},"about":null,"party_name":{"en":"Congress","hi":"कांग्रेस"},"party_info":null}))
    this.getVoterList()
  }

  getVoterList() {
    let data = {
      end_point: 'FETCH_VOTER_LIST_API_URL',
      page: 1,
      limit: 30,
    }
    this.http
    .getVoterList(data)
    .subscribe(
      (res: any)=> {
        if(res.success) {
          this.voterList = res?.data
          this.indexedDbService.saveData(1, { response_data: this.voterList })
        }else {
          this.indexedDbService.getData(1).then((result) => {
            this.voterList = result.data;
            console.log(this.voterList)
          });
        }
      }, (error: any) => {
        this.indexedDbService.getData(1).then((result) => {
          this.voterList = result.data;
          console.log(this.voterList)
        });
      }
    )
  }
}
