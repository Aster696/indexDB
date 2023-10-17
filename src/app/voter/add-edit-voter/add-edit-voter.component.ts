import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { GlobalService } from 'src/app/service/global.service';
import { ApiService } from 'src/app/service/http-service';

@Component({
  selector: 'app-add-edit-voter',
  templateUrl: './add-edit-voter.component.html',
  styleUrls: ['./add-edit-voter.component.css']
})
export class AddEditVoterComponent implements OnInit {

  curr_voterId: any;
  voterDetails: any;
  voterForm: FormGroup;
  _currLanguage: any;
  isEdit: boolean = false;
  api_loading = { card: false, button: false }
  constructor(private fb: FormBuilder, private router: Router, private acRoute: ActivatedRoute, private message: NzMessageService,
    private http: ApiService,
    private global: GlobalService
  ) { }

  ngOnInit(): void {
    this._currLanguage = localStorage.getItem("appLanguage") || 'en';
    this.acRoute.queryParams.subscribe((params: any) => {
      if (params['id']) {
        this.curr_voterId = params.id;
        this.global.params = {id: this.curr_voterId}
        this.isEdit = true;
        if (this.curr_voterId) {
          this.getVoterDetails()
        }
      }
      this.createVoter();
    })
  }

  // get image
  // @ViewChild('videoElement') videoElement!: ElementRef<HTMLVideoElement>;
  // @ViewChild('canvasElement') canvasElement!: ElementRef<HTMLCanvasElement>;

  // cameraStarted = false;
  // photoTaken = false;
  // capturedImage: any;
  // image: any

  // async startCamera() {
  //   try {
  //     this.photoTaken = false;
  //     this.capturedImage = null;
  //     this.image = null;
  
  //     const stream = await navigator.mediaDevices.getUserMedia({ video: true });
  //     this.videoElement.nativeElement.srcObject = stream;
  //     this.cameraStarted = true;
  //   } catch (error) {
  //     console.error('Error accessing camera:', error);
  //   }
  // }

  // capturePhoto() {
  //   const video = this.videoElement.nativeElement;
  //   const canvas = this.canvasElement.nativeElement;

  //   canvas.width = video.videoWidth;
  //   canvas.height = video.videoHeight;
  //   canvas.getContext('2d')?.drawImage(video, 0, 0, canvas.width, canvas.height);

  //   canvas.toBlob((blob) => {
  //     if (blob) {
  //       this.capturedImage = blob;
  //       this.photoTaken = true;
  //     }
  //   }, 'image/png')
  //   this.image = canvas.toDataURL('image/png');
  //   this.photoTaken = true;

  //   // Stop the video stream
  //   const stream = video.srcObject as MediaStream;
  //   if (stream) {
  //     const tracks = stream.getTracks();
  //     tracks.forEach((track) => {
  //       track.stop();
  //     });
  //   }
  //   this.cameraStarted = false

  //   // Hide the video element
  //   video.style.display = 'none';
  // }

  fileList : any;
  _currentFileName : any=[];
  beforeUploadName = (file: any): boolean => {
    if (!((file?.type == 'img') || (file?.type == 'jpeg') || (file?.type == 'png') || (file?.type == 'image/jpeg') || (file?.type == 'image/png'))) {
      this.message.error('Please check the file type');
      return false;
    }
    this.fileList = file[file.length - 1];
    console.log(this.fileList)
    return true;
  }

  selectedImageSrc: any;
  handleFileChange(file: any): void {
    this.fileList = file.target.files[0];

    if (this.fileList) {
      const selectedFile: File = this.fileList;

      // Create a data URL from the selected file
      const reader = new FileReader();
      reader.onload = (e) => {
        this.selectedImageSrc = e.target?.result as string;
      };
      reader.readAsDataURL(selectedFile);

      // console.log('Selected file:', selectedFile);
    }
  }

// voter detail
  getVoterDetails() {
    this.searchStaticDataGlobalFunction('Booth');
    let data = { id: this.curr_voterId, 'end_point': 'FETCH_VOTER_LIST_API_URL' }
    this.api_loading['card'] = true;
    // console.log(this.curr_voterId)
    this.http.getVoterDetails(data).subscribe((res: any) => {
      if (res.success) {
        this.voterDetails = res.data[0];
        this.createVoter(res.data[0])
        this.api_loading['card'] = false;
      } else {
        this.api_loading['card'] = false;
      }
    }, error => { this.api_loading['card'] = false; })
  }


  createVoter(data?) {
    this.voterForm = this.fb.group({
      FIRST_NAME: [(data ? (this._currLanguage == 'en' ? data?.first_name_en : data?.first_name_hi) : ''), [Validators.required]],
      LAST_NAME: [(data ? (this._currLanguage == 'en' ? data?.last_name_en : data?.last_name_hi) : ''), [Validators.required]],
      FULL_NAME: [(data ? (this._currLanguage == 'en' ? data?.full_name_en : data?.full_name_hi) : '')],
      mobile: [(data ? (this._currLanguage == 'en' ? data?.mobile : data?.mobile) : ''), [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      caste: [(data ? (this._currLanguage == 'en' ? data?.caste : data?.caste) : ''), [Validators.required]],

      RLN_TYPE: [(data ? (this._currLanguage == 'en' ? data?.rln_type : data?.rln_type) : '')], //Check

      RLN_FIRST_NAME: [(data ? (this._currLanguage == 'en' ? data?.rln_first_name_en : data?.rln_first_name_hi) : '')],
      RLN_LAST_NAME: [(data ? (this._currLanguage == 'en' ? data?.rln_last_name_en : data?.rln_last_name_hi) : '')],
      RLN_FULL_NAME: [(data ? (this._currLanguage == 'en' ? data?.rln_full_name_en : data?.rln_full_name_hi) : '')],
      // FULL_NAME_WITH_RLN: [(data ? (this._currLanguage == 'en' ? data?.full_name_en_with_rln : data?.full_name_hi_with_rln) : ''), [Validators.required]],
      GENDER: [(data ? (this._currLanguage == 'en' ? data?.gender : data?.gender) : '')],
      AGE: [(data ? (this._currLanguage == 'en' ? data?.age : data?.age) : ''), [Validators.required]],
      EPIC_NO: [(data ? (this._currLanguage == 'en' ? data?.epic_no : data?.epic_no) : ''), [Validators.required]],

      PSBUILDING_NAME: [(data ? (this._currLanguage == 'en' ? data?.psbuilding_name_en : data?.psbuilding_name_hi) : ''),],
      // SECTION_NAME: [(data ? (this._currLanguage == 'en' ? data?.section_name_en : data?.section_name_hi) : ''),],
      // PART_NAME: [(data ? (this._currLanguage == 'en' ? data?.part_name_en : data?.part_name_hi) : ''),],
      // SLNOINPART: [(data ? (this._currLanguage == 'en' ? data?.slnoinpart : data?.slnoinpart) : ''),],
      // PART_NO: [(data ? (this._currLanguage == 'en' ? data?.part_no : data?.part_no) : ''),],
      anubhag: [(this._currLanguage == 'en' ? data?.anubhag : data?.anubhag )],
      booth: [(data ? (this._currLanguage == 'en' ? Number(data?.booth_id) : Number(data?.booth_id)) : ''), [Validators.required]],
      // SECTION_NO: [(data ? (this._currLanguage == 'en' ? data?.section_no : data?.section_no) : ''),],
      HOUSE_NO: [(data ? (this._currLanguage == 'en' ? data?.house_no : data?.house_no) : ''),],
      facebook_link: [(data ? (this._currLanguage == 'en' ? data?.facebook_link : data?.facebook_link) : ''),],

    })
  }

  submitForm() {
    if (this.voterForm.invalid) {
      return
    }
    this.api_loading['button'] = true;
    var form_data = new FormData();
    form_data.append('device_details', JSON.stringify(this.global.location))
    this.fileList ? form_data.append(`profile_picture`, this.fileList) : null
    // for ( var key in this.voterForm.controls ) {
    //   console.log(form_data)
    // form_data.append(key,this.voterForm[key];value,this.voterForm.controls[key].value);
    if (this.voterForm.get('FIRST_NAME').value) {
      form_data.append('FIRST_NAME', this.voterForm.get('FIRST_NAME').value);
    }
    // }

    if (this.voterForm.get('LAST_NAME').value) {
      form_data.append('LAST_NAME', this.voterForm.get('LAST_NAME').value);
    }

    if (this.voterForm.get('FULL_NAME').value) {
      form_data.append('FULL_NAME', this.voterForm.get('FULL_NAME').value);
    }else {
      form_data.append('FULL_NAME', this.voterForm.get('FIRST_NAME').value + ' ' + this.voterForm.get('LAST_NAME').value);

    }

    if (this.voterForm.get('RLN_TYPE').value) {
      form_data.append('RLN_TYPE', this.voterForm.get('RLN_TYPE').value);
    }

    if (this.voterForm.get('mobile').value) { form_data.append('mobile', this.voterForm.get('mobile').value); }


    if (this.voterForm.get('caste').value) { form_data.append('caste', this.voterForm.get('caste').value); }

    if (this.voterForm.get('RLN_FIRST_NAME').value) { form_data.append('RLN_FIRST_NAME', this.voterForm.get('RLN_FIRST_NAME').value); }

    if (this.voterForm.get('RLN_LAST_NAME').value) { form_data.append('RLN_LAST_NAME', this.voterForm.get('RLN_LAST_NAME').value); }

    if (this.voterForm.get('RLN_FULL_NAME').value) { form_data.append('RLN_FULL_NAME', this.voterForm.get('RLN_FULL_NAME').value); }

    if (this.voterForm.get('GENDER').value) {
      form_data.append('GENDER', this.voterForm.get('GENDER').value);
    }
    // form_data.append('FULL_NAME_WITH_RLN',this.voterForm.get('FULL_NAME_WITH_RLN').value);

    if (this.voterForm.get('AGE').value) {
      form_data.append('AGE', this.voterForm.get('AGE').value);
    }

    if (this.voterForm.get('EPIC_NO').value) {
      form_data.append('EPIC_NO', this.voterForm.get('EPIC_NO').value);
    }

    if (this.voterForm.get('PSBUILDING_NAME').value) {
      form_data.append('PSBUILDING_NAME', this.voterForm.get('PSBUILDING_NAME').value);
    }

    // if (this.voterForm.get('SECTION_NAME').value) {
    //   form_data.append('SECTION_NAME', this.voterForm.get('SECTION_NAME').value);
    // }

    // if (this.voterForm.get('PART_NAME').value) {
    //   form_data.append('PART_NAME', this.voterForm.get('PART_NAME').value);
    // }

    // if (this.voterForm.get('SLNOINPART').value) {
    //   form_data.append('SLNOINPART', this.voterForm.get('SLNOINPART').value);
    // }

    // if (this.voterForm.get('PART_NO').value) {
    //   form_data.append('PART_NO', this.voterForm.get('PART_NO').value);
    // }

    if (this.voterForm.get('anubhag').value) {
      form_data.append('anubhag', this.voterForm.get('anubhag').value);
    }

    if (this.voterForm.get('booth').value) {
      form_data.append('booth', this.voterForm.get('booth').value);
    }

    // if (this.voterForm.get('SECTION_NO').value) {
    //   form_data.append('SECTION_NO', this.voterForm.get('SECTION_NO').value);
    // }

    if (this.voterForm.get('HOUSE_NO').value) {
      form_data.append('HOUSE_NO', this.voterForm.get('HOUSE_NO').value);
    }
    if (this.voterForm.get('facebook_link').value) {
      form_data.append('facebook_link', this.voterForm.get('facebook_link').value);
    }

    let url = this.isEdit == false ? this.http.addVoter(form_data) : this.http.editVoter(this.curr_voterId, form_data);
    url.subscribe((res: any) => {
      if (res.success) {
        this.message.success(res.message);
        !this.isEdit ? this.router.navigate(['/voter']) : this.router.navigate(['/voter/view-profile'], { queryParams: { id: this.curr_voterId } })
        this.api_loading['button'] = false;
      } else {
        this.api_loading['button'] = false;
      }
    }, errpr => {
      this.api_loading['button'] = false;
    })
  }

  debounce: any;
  boothList: any = [];
  wardList: any = [];
  sectorList: any = []
  searchStaticDataGlobalFunction(event, data?) {
    clearTimeout(this.debounce);
    this.debounce = setTimeout(() => {
      let data = { model_name: event }
      this.http.getMasterData(data).subscribe((res: any) => {
        if (res.success) {
          if (event == 'anubhag') {
            this.boothList = res.data;
          }else if (event == 'Booth') {
            this.boothList = res.data;
          } else if (event == 'Ward') {
            this.wardList = res.data;
          } else if (event == 'Sector') {
            this.sectorList = res.data;
          }
        }
      })
    }, 500);
  }

  cancelForm() {
    !this.isEdit ? this.router.navigate(['/voter']) : this.router.navigate(['/voter/view-profile'], { queryParams: { id: this.curr_voterId } })
    // this.router.navigate([this.router.url.split('?')[0]], { queryParams: { tabSection: this.curr_voterId } });
  }

}
