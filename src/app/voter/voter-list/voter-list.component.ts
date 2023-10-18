import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Data, Router } from '@angular/router';
import * as FileSaver from 'file-saver';
import * as moment from 'moment';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzMarks } from 'ng-zorro-antd/slider';
import { GlobalService } from 'src/app/service/global.service';
import { ApiService } from 'src/app/service/http-service';
import { IndexedDbService } from 'src/app/service/index-db-server';
import { NetworkStatusService } from 'src/app/service/network-checker-service';
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-voter-list',
  templateUrl: './voter-list.component.html',
  styleUrls: ['./voter-list.component.css']
})

export class VoterListComponent implements OnInit {
  quickViewVisible: boolean = false;
  _currSearchValue: any;
  total_count: any;
  isSelectLoader  = {
    "Booth":false,
    "Ward":false,
    "Street":false,
    "Lane":false,
    "Sector":false,
    "Assembly":false,
    "Start_Mark": false
  }
  _currBooth: any;
  _currWard: any;
  _currSector: any;
  _currZone: any;
  _currStarMark: any

  _currBenificary: any;
  activityList : any = [];
followUpList : any= []

  api_loader = { 'list': false, 'accordian':false, 'button_markActivity':false }
  votersist: any = [
    { user_name: 'Amit Jain', epic_no: '1685419', url: '../.././../assets/images/avatars/dy_post_image.jpg', tags: [{ value: 'Booth no 5' }, { value: 'Ward No 8' }] },
    { user_name: 'Ayesha', epic_no: '1685419', url: '../.././../assets/images/avatars/thumb-9.jpg', tags: [{ value: 'Booth no 5' }, { value: 'Ward No 8' }] },
    { user_name: 'Amit Jain', epic_no: '1685419', url: '../.././../assets/images/avatars/thumb-10.jpg', tags: [{ value: 'Booth no 5' }, { value: 'Ward No 8' }] },
    { user_name: 'Amit Jain', epic_no: '1685419', url: '../.././../assets/images/avatars/thumb-8.jpg', tags: [{ value: 'Booth no 5' }, { value: 'Ward No 8' }] }
  ]

  isBannerVisible: boolean = true;
  _currLanguage: any;
  globalData: any
  _isOnline: boolean = false;



  // Multiple Voter activity and followup add
  isActivityModal : boolean = false;
  isFollowUpModal : boolean = false;
  isEdit:boolean = false;
  followUpForm: FormGroup;

  currFormType : any;
  votersList_Array: any = [];

  dateFormat = "YYYY-MM-dd";
  mobileForm: FormGroup

  voterParams: any
  
  constructor(public global: GlobalService, private fb:FormBuilder, private http: ApiService, private message: NzMessageService, private router: Router, private aroute: ActivatedRoute,
    private indexedDbService: IndexedDbService, private networkStatusService: NetworkStatusService  
  ) { }

  async ngOnInit() {
    this.global.logout = localStorage.getItem('iyc_user_token')
    setTimeout(() => {
      this.global.userData= JSON.parse(localStorage.getItem('iyc_user_data'))
      this.global.globalUser= JSON.parse(localStorage.getItem('global_account_data'))
      this.global.domainUser= JSON.parse(localStorage.getItem('domain_user'))
    this.global.getSubDomain(this.global.domainUser?.account_code)

    }, 1000);
    this._currLanguage = localStorage.getItem("appLanguage") || 'hi';
    this.createMobileForm()
    this.global.globalAccountData.subscribe((res: any) => {
      if (res) {
        this.globalData = res
        this.getVotersList()
      }
    })
    this.aroute.queryParams.subscribe((params) => {
      if(params) {
        this.voterParams = params

        this.getVotersList()
      }
    })
    for(let i = 0; i < 200; i++) {
      await this.getPreVotersList()
    }
  }

  searchIndexDb() {
    this.networkStatusService.isOnline().subscribe((online: any) => { 
      if(!online) {
        this.votersList = this.indexedDbService.searchDataByProperty('data', this._currSearchValue)
      }
    })
  }

  createMobileForm(data?) {
    this.mobileForm = this.fb.group({
      mobile: [data?.mobile || '', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]]
    })
  }

  public exportExcel(): void {

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.votersList);
    const wb: XLSX.WorkBook = { Sheets: { 'data': ws }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    this.saveExcelFile(excelBuffer, '.xlsx');
  }


  // update tempData
  tempData() {
    this.votersList?.forEach(voter => {
      if(voter?.id === this.voter_id) {
        voter.rate_type = this.rating_type
        voter.rating = this.rating
        voter.mobile = this.mobileForm?.get('mobile')?.value
        voter.star_marked = this.isStar
      }
    })
  }

  rating = 1;
  isRatingDrawer:boolean = false;
  rating_type: string = 'CANDIDATE'
  voter_id: any
  marks: NzMarks = {
    1: '1',
    2: '2',
    3: '3',
    4: '4',
    5: '5',
  }
  isRating: boolean = false
  rateVoter(){

    if(!this._isOnline){

      console.log("Rate voter calling here only")
      let payload = {}
      payload['device_details'] = JSON.stringify(this.global.location)
      payload['rating'] = JSON.stringify(this.rating)
      payload['rating_type'] = this.rating_type
      payload['service_type'] = "RATING"
      payload['voter_id'] = this.voter_id
      this.indexedDbService.storeActivityData(payload)
      this.isRatingDrawer = false
      return
    }
    this.isRating = true
    let data= new FormData();
    // data['voter_id'] = this._currVoterId
    data.append('device_details', JSON.stringify(this.global.location))
    data.append('rating',JSON.stringify(this.rating));
    data.append('rating_type', this.rating_type)
    this.tempData()
    this.http.editVoter(this.voter_id,data).subscribe((res:any)=>{
      if(res.success){
        this.isRatingDrawer = false
        // this.getVotersList();
        this.tempData()
        this.message.success(res.message)
      }else{
        this.isRatingDrawer = false
        this.message.success(res.message)
      }
      this.isRating = false
    },error=>{
      this.isRatingDrawer = false
      this.isRating = false
    })
  }

  formatter(value: number): string {
    let returnData = '';
   if(value == 1 ){
      returnData = 'Pro BJP - 100% BJP'
    }else if(value == 2 ){
      returnData = 'BJP Positive'
    }else if(value == 3 ){
      returnData = 'Neutral'
    }else if(value == 4 ){
      returnData = 'Congress positive'
    }else if(value == 5 ){
      returnData = 'Pro Congress - 100% congress'
    }
    return returnData;
  }

  isMobile: boolean = false
  editMobileNumber() {
    if(!this._isOnline){

      console.log("Saving mobile to offline")
      let payload = {}
      payload['device_details'] = JSON.stringify(this.global.location)
      payload['mobile'] = this.mobileForm?.get('mobile')?.value
      payload['service_type'] = "MOBILE"
      payload['voter_id'] = this.voter_id
      this.indexedDbService.storeActivityData(payload)
      this.isVisible = false
      this.isMobile = false
      return
    }

    if(this.mobileForm?.valid) {
      this.isMobile = true
      let formData = new FormData()
      formData.append('device_details', JSON.stringify(this.global.location))
      formData.append('mobile', this.mobileForm?.get('mobile')?.value)
      this.tempData()
      this.http.editVoter(this.voter_id, formData)
      .subscribe((res: any) => {
        if (res.success) {
          this.message.success(res.message);
          // this.getVotersList()
          this.isVisible = false
        } else {
          this.isVisible = false
        }
        this.isMobile = false
      }, errpr => {
        this.isVisible = false;
        this.isMobile = false
      })
    }else {
      this.message.error('Field cannot be empty')
      Object.keys(this.mobileForm.controls).forEach((controlName) => {
        const control = this.mobileForm.get(controlName);
        if (control.invalid) {
          // console.log(controlName)
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      })
    }
  }

  private saveExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {type: '.xlsx'});
    FileSaver.saveAs(data, fileName + '.xlsx');
  } 

  // add edit image
  selectedImageSrc: any;
  handleFileChange(file: any): void {
    this.fileList = file.target.files[0];

    if (this.fileList) {
      const selectedFile: File = this.fileList;

      // Create a data URL from the selected file
      const reader = new FileReader();
      reader.onload = (e) => {
        this.selectedImageSrc = e.target?.result as string;
        this.votersList?.forEach((data) => {
          if(data?.id === this.voter_id) {
            data.profile_picture = this.selectedImageSrc
          }
        })
      };
      reader.readAsDataURL(selectedFile);

      // console.log('Selected file:', selectedFile);
    }
    this.submitImageForm()
  }

  submitImageForm() {

    if(!this._isOnline){
      let payload = {}
      payload['device_details'] = JSON.stringify(this.global.location)
      payload['profile_picture'] = this.fileList
      payload['service_type'] = "PROFILE_PICTURE"
      payload['voter_id'] = this.voter_id
      this.indexedDbService.storeActivityData(payload)
      return
    }
    
    var form_data = new FormData();
    form_data.append('device_details', JSON.stringify(this.global.location))
    this.fileList ? form_data.append(`profile_picture`, this.fileList) : null
    

    let url = this.http.editVoter(this.voter_id, form_data);
    url.subscribe((res: any) => {
      if (res.success) {
        this.message.success(res.message);
        this.router.navigate(['/voter'])

      } 
    }, errpr => {
    })
  }

  tempTrail = [   {
    "key_changes": [
        {
            "key": "Updated at",
            "old_value": "2023-06-14T09:39:31.001Z",
            "new_value": "2023-06-14T09:42:06.283Z"
        },
        {
            "key": "Rating",
            "old_value": null,
            "new_value": 5
        }
    ],
    "created_at": "2023-06-14T09:42:06.283156Z",
    "created_by": "8828349328"
},
{
    "key_changes": [
        {
            "key": "Age",
            "old_value": "18",
            "new_value": "25"
        },
        {
            "key": "Updated at",
            "old_value": "2023-06-13T11:33:41.009Z",
            "new_value": "2023-06-13T11:34:48.903Z"
        }
    ],
    "created_at": "2023-06-13T11:34:48.902754Z",
    "created_by": "8828349328"
},]

  setParams() {
    let data = {}
    if (this._currBooth) {
      data['booth'] = this._currBooth;
    }
    if (this._currWard) {
      data['ward'] = this._currWard;
    }
    if (this._currSector) {
      data['sector'] = this._currSector;
    }

    if (this._currZone) {
      data['zone'] = this._currZone;
    }
    if (this._currStarMark !== undefined && this._currStarMark !== null) {
      data['star_marked'] = this._currStarMark;
    }

    if (this._currLane) {
      data['lane'] = this._currLane;
    }
    if (this._crrAssembly) {
      data['assembly'] = this._crrAssembly;
    }
    if (this._currStreet) {
      data['street'] = this._currStreet;
    }

    if (this._currBenificary) {
      data['is_benificary'] = this._currBenificary;
    }
    this.router.navigate(['/voter'], {queryParams: data})
  }
  votersList: any = []
  pageIndex = 1;
  globalPageSize = 30;
  getVotersList(tableFilter?, loader?) {
    // console.log(tableFilter)
    this.api_loader['list'] = true;
    this.votersList = []
    let data = { 'end_point': 'FETCH_VOTER_LIST_API_URL' }

    if (tableFilter) {
      this.pageIndex = tableFilter?.pageIndex || tableFilter;
      this.globalPageSize = tableFilter?.pageSize || this.globalPageSize;
      data['page'] = this.pageIndex
      data['limit'] = this.globalPageSize
    } else {
      data['page'] = this.pageIndex
      data['limit'] = this.globalPageSize
    }
    Object.keys(this.voterParams).forEach(key => {
      data[key] = this.voterParams[key]
    })
    
    if (this._currSearchValue) {
      let temp = this._currLanguage == 'en' ? 'search_param' : 'search_param'
      data[temp] = this._currSearchValue;
    }

    this.networkStatusService.isOnline().subscribe((online: any) => {
      this._isOnline = online
      console.log(online)
      if (online){
        this.http.getVoterList(data).subscribe((res: any) => {
          if (res?.success) {
            this.votersList = res?.data;
            this.total_count = res.total_count
            this.api_loader['list'] = false
            // this.indexedDbService.saveData( res?.data)
          } else {
            this.api_loader['list'] = false
          }
        })
        
        // ### call background process
        this.pushDataWhenOnline()
        ///////////////////////////////

      } else{
        this.indexedDbService.getData(this.pageIndex, this.globalPageSize).then((result: any) => {
          this.votersList = []
          // for(let info of result) {
          //   this.votersList.push(info?.data)
          // }
          this.votersList = result?.data
          console.log(this.votersList)
        });
        this.api_loader['list'] = false

      }
    });
  }

  dumbPage: number = 1
  getPreVotersList() {
    let data = { 'end_point': 'FETCH_VOTER_LIST_API_URL' }
    data['page'] = this.dumbPage
    data['limit'] = 30
    return new Promise((resolve, reject) => {
      this.http.getVoterList(data).subscribe((res: any) => {
        if (res.success) {
          for(let info of res?.data) {
            this.indexedDbService.saveData(info)
            console.log(info)
          }
          // this.dumbPage = this.dumbPage + 1
          resolve(res?.data)
        }else {
          reject(res?.success)
        }
      })
    })
    
  }

  // current Buttons:
  _currToggleActions : any;
  quickViewToggle(): void {
    this.isActivityModal = false
    this.quickViewVisible = !this.quickViewVisible;
    console.log( this._currToggleActions)
  }

  debounce: any;
  boothList: any = [];
  wardList: any = [];
  sectorList: any = [];
  _crrAssembly:any;
  assemblyList : any = [];
  zoneList: any = []
  _currStreet : any;
  streetList:any = [];
  _currLane: any;
  laneList : any = [];

  searchStaticDataGlobalFunction(event, data?) {
    this.isSelectLoader[event] = true;
    clearTimeout(this.debounce);
    this.debounce = setTimeout(() => {
      let data = { model_name: event }
      this.http.getMasterData(data).subscribe((res: any) => {
        if (res.success) {
          if (event == 'Booth') {
            this.boothList = res.data;
          } else if (event == 'Ward') {
            // console.log(res.data)
            this.wardList = res.data;
          } else if (event == 'Sector') {
            this.sectorList = res.data;
          } else if (event == 'Zone') {
            this.zoneList = res.data;
          } else if (event == 'Start_Mark') {
            // this.zoneList = res.data;
          }  else if (event == 'Street') {
            this.streetList = res.data;
          }
          else if (event == 'Lane') {
            this.laneList = res.data;
          }
          else if (event == 'Assembly') {
            this.assemblyList = res.data;
          }
          this.isSelectLoader[event] = false;
        }
      })
    }, 500);
  }

  resetFilter() {
    this._currSearchValue = null;
    this._currBooth = null;
    this._currSector = null;
    this._currZone = null;
    this._currWard = null;
    this._currLane = null;
    this._currStreet = null;
    this._crrAssembly = null;
    this._currStarMark = null
    this.pageIndex = 1;
    this.quickViewVisible = false;
    this.setParams()
    this.getVotersList()
  }

  getPipeValue(data) {
    let temp;
    if(data){
      temp = data.split(' ');
    }else{
      return;
    }
    let value;
    if (temp.length > 0) {
      for (let i = 0; i < temp.length; i++) {

        if (temp[i] == 0) {
          value = temp[0].substring(0, 1) + (temp[temp.length - 1].substring(0, 1) ? temp[temp.length - 1].substring(0, 1) : '--');
        }
      }
    }
    return value;
  }

  switchValue: any;
  currVoterDetails: any;
  getSwitchValue(data) {
    if (data?.status == 'Inactive') {
      this.switchValue = false;
    } else if (data?.status == 'Active') {
      this.switchValue = true
    }
    this.currVoterDetails = data
    return this.switchValue
  }

  _currentAuditId : any;
  checked: boolean = false;
  indeterminate: boolean = false;
  listOfCurrentPageData: readonly Data[] = [];
  setOfCheckedId = new Set<number>();
  // Table Dropdowns functions
  expandSet = new Set<number>();
  onExpandChange(id: number, checked: boolean, index): void {

    if (checked) {
      this.expandSet.add(id);
      this._currentAuditId = id
      this.getAuditTrail(index);
    } else {
      this.expandSet.delete(id);
    }
  }

  updateCheckedSet(id: number, checked: boolean): void {
    if (checked) {
      
      
      this.setOfCheckedId.add(id);
    } else {
      this.setOfCheckedId.delete(id);
    }
    // console.log(this.setOfCheckedId);
  }

  onCurrentPageDataChange(listOfCurrentPageData: Data[]): void {
    this.listOfCurrentPageData = listOfCurrentPageData;
    this.refreshCheckedStatus();
  }

  onItemChecked(id: number, checked: boolean): void {
    this.updateCheckedSet(id, checked);
    this.refreshCheckedStatus();
  }

  onAllChecked(checked: boolean): void {
    this.listOfCurrentPageData
      .filter(({ disabled }) => !disabled)
      .forEach(({ id }) => this.updateCheckedSet(id, checked));
    this.refreshCheckedStatus();
  }

  refreshCheckedStatus(): void {
    const listOfEnabledData = this.listOfCurrentPageData.filter(({ disabled }) => !disabled);
    this.checked = listOfEnabledData.every(({ id }) => this.setOfCheckedId.has(id));
    this.indeterminate = listOfEnabledData.some(({ id }) => this.setOfCheckedId.has(id)) && !this.checked;
  }

  getAuditTrail(arrayIndex){
    this.api_loader['accordian'] = true;
    this.votersList[arrayIndex]['auditDataset']= [];
    // console.log(this.votersList[arrayIndex]);
    
    let data = {id:this._currentAuditId, model_name:'electoralchattdataset'}
    this.http.getAuditTrail(data).subscribe((res:any)=>{
      if(res.success){
        this.votersList[arrayIndex]['auditDataset'] = res.data;
        this.api_loader['accordian'] = false;
      }else{
        this.api_loader['accordian'] = false;
      }
      // console.log(this.votersList[arrayIndex]['auditDataset'])
    },error=>{
    })
  }

  // Var for activit and followup
  fileList : any = []
  // Activity and FollowUp:
  createNewFollow(type){
    this.currFormType = type;
    this.quickViewVisible = true;
    this.fileList = []
    if (type == 'activity') {
      
      // console.log( moment(JSON.stringify(data?.followup_datetime)).format("HH:mm:ss"))
      this.followUpForm = this.fb.group({
        followup_datetime: [ new Date(),   [Validators.required]],
        // activity_type: ['', [Validators.required]],
        // task_type: ['', [Validators.required]],
        comments: ['', [Validators.required]]
      })
    } else {
      this.followUpForm = this.fb.group({
        followup_datetime: [new Date(), [Validators.required]],
        followup_time : [null,[Validators.required]],
        // followup_type: [null, [Validators.required]],
        // task_type: ['', [Validators.required]],
        comments: ['', [Validators.required]]
      })
    }
  }

  getActivityList() {
    let data = {'model_name':'Activity'}
    this.http.getMasterData(data).subscribe((res:any)=>{
      if(res.success) {
        this.activityList = res.data
      }
    })
  }


  getFolloupList(){
    let data = {'model_name':'FollowUp'}
    this.http.getMasterData(data).subscribe((res:any)=>{
      if(res.success) {
        this.followUpList = res.data
      }
    })
  }

  // Task list
  taskList = []
  getTaskList() {
    let data = {}
    data['model_name'] = 'Tasks'
    this.http
    .getMasterData(data)
    .subscribe(
      (res: any) => {
        if(res?.success) {
          this.taskList = res?.data
        }
      }
    )
  }

  submitForm(form?) {
    this.votersList_Array = this.setOfCheckedId;
    let formDatta =new FormData();
    formDatta.append('voters',this.votersList_Array);
    // return 
    if (this.followUpForm.invalid) { return }
    this.api_loader['button_markActivity'] = true
    let data = new FormData();
    data.append('voter_id' , this.voter_id ? this.voter_id : JSON.stringify(Array.from(this.votersList_Array)))
   
    // this.currFormType == 'activity' ?   data.append('activity_type', this.followUpForm.get('activity_type').value) : data.append('followup_type', this.followUpForm.get('followup_type').value) ;
    data.append('comments', this.followUpForm.get('comments').value)
    // data.append('task_type', this.followUpForm?.get('task_type')?.value)
    this.currFormType == 'activity' ? 
    data.append('activity_date', moment(this.followUpForm.get('followup_datetime').value).format("YYYY-MM-DD")) :
    data.append('followup_datetime', moment(this.followUpForm.get('followup_datetime').value).format("YYYY-MM-DD") + ' ' +moment(this.followUpForm.get('followup_time').value).format("HH:mm:ss"));
    this.fileList.forEach((file: any, index: number) => {
      data.append(`file_set`, file); // Assuming file is a File object
    });
    // data.append('file_set', JSON.stringify(Array.from(this.fileList)))
    // this.currFormType == 'followUp' ? data.append('followup_time',moment(this.followUpForm.get('followup_datetime').value).format("HH:mm:ss")):'';
    // if(this.currFormType == 'activity'){console.log('Activity')}else{console.log('FollowUp')}
    let url = (this.currFormType == 'activity' ? this.http.addVoterActivity(data) : this.http.addVoterFollowup(data))
    url.subscribe((res:any)=>{
      if(res.success){
        this.message.success(res.message);
        this.isActivityModal = false
        this.quickViewToggle();
        this.followUpForm.reset();
        this.api_loader['button_markActivity'] = false;
      }else{
        // this.message.error(res.message)
        this.api_loader['button_markActivity'] = false
      }
    },error=>{
      this.api_loader['button_markActivity'] = false
    })
  }

  // mark star
  isStar: boolean = false
  starLoader() {
    let form_data = new FormData()
    form_data.append('star_marked', JSON.stringify(this.isStar))
    form_data.append('star_marked_at', moment().format('YYYY-MM-DD'))
    this.tempData()

    let url =  this.http.editVoter(this.voter_id, form_data);
    url.subscribe((res: any) => {
      if (res.success) {
        this.message.success(res.message);
        // this.getVotersList()
      } 
    }, errpr => {
    })
  }

  // model
  isVisible: boolean = false
  modalTitle: string = ''
  voterInfo: any
  showModal(str?, data?) {
    this.modalTitle = str
    this.isVisible = true
    this.voterInfo = data
  }

  handleClose() {
    this.modalTitle = ''
    this.isVisible = false
  }




  // ##### this function is used to push the data in background when get online connection
  pushDataWhenOnline(){
    let offline_activity_data = []
    this.indexedDbService.getOfflineActivityData().then((result) => {
      offline_activity_data = result

      for(var a_offline_data in offline_activity_data){

        // #### process the api calls
        let service_dataset = {}
        let form_data = new FormData;

        for(var a_data in offline_activity_data[a_offline_data].data){
          if(a_data == "service_type" || a_data == "voter_id"){
            service_dataset[a_data] = offline_activity_data[a_offline_data].data[a_data]
            continue
          }

          form_data.append(a_data, offline_activity_data[a_offline_data].data[a_data])
          // console.log(offline_activity_data[a_offline_data].data[a_data])
        }


        // ### now call the API
        this.http.editVoter(service_dataset['voter_id'], form_data).subscribe((res:any)=>{
          if(res.success){
            // console.log("deleting the index", offline_activity_data[a_offline_data].id)
            // this.indexedDbService.deleteOfflineActivityData(offline_activity_data[a_offline_data].id)
          }
        })
        this.indexedDbService.deleteOfflineActivityData(offline_activity_data[a_offline_data].id)

        console.log(offline_activity_data[a_offline_data])
      }
    });
  }

}
