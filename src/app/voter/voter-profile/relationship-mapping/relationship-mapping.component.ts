import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { GlobalService } from 'src/app/service/global.service';
import { ApiService } from 'src/app/service/http-service';

@Component({
  selector: 'app-relationship-mapping',
  templateUrl: './relationship-mapping.component.html',
  styleUrls: ['./relationship-mapping.component.css']
})
export class RelationshipMappingComponent implements OnInit {
  @Input() voterId;
  attributeList: any = [];
  constructor(private http: ApiService, private message: NzMessageService, private fb: FormBuilder, private global: GlobalService) { }

  ngOnInit(): void {
    this._currLanguage = localStorage.getItem("appLanguage") || 'en';
    if (this.voterId) {
      this.getAttributeList();
    }
  }

  _currLanguage: any;
  getAttributeList(keyword?) {
    let data = { "voter_id": this.voterId }
    data['for_relationship'] = "YES";
    this.http.getRelationList(data).subscribe((res: any) => {
      if (res.success) {
        this.attributeList = res.data;
        console.log(this.attributeList);
        
        this.attributeList.forEach(element => {
          element['_currTagValue'] = "";
          element['_isVisible'] = false;
        });
      }
    })
  }

  // get relationship list
  relationshipList = []
  getRelationship() {
    let data = {}
    data['model_name'] = 'RelationshipMaster'
    this.http
    .getMasterData(data)
    .subscribe(
      (res: any) => {
        if(res?.success) {
          this.relationshipList = res?.data
        }
      }
    )
  }

  debounce: any;
  tagsList: any;
  _currPrimaryAttributeID: any;
  getTagLIst(isSearch?, key?) {
    let data = { "model_name": "TagMaster" }
    clearTimeout(this.debounce);
    this.debounce = setTimeout(() => {
      this.http.getMasterData(data).subscribe((res: any) => {
        if (res.success) {
          this.tagsList = res.data
        }
      })
    }, 500);

  }

  addTagForAttribute(data,i) {
    this.attributeList[i]._isVisible = true;
    for (let i = 0; i < this.tagsList.length; i++) {
      const element = this.tagsList[i];
      if (element?.name?.en == data._currTagValue) {
        this.message.warning("The tag is already mapped");
        return;
      }
    }
    let param = { "voter_id": [this.voterId], "primary_attribute": data?.id, "tag": data?._currTagValue,
      "device_details": this.global.location
    };
    this.http.addVoterTasg(param).subscribe((res: any) => {
      if (res.success) {
        this.message.success(res.message);
        this.attributeList[i]._isVisible = false;
        this.getAttributeList();

      } else {
        // this.message.error(res.message)
        this.attributeList[i]._isVisible = false;
      }
    })
  }

  test(data, id) {
    this.attributeList[id]._currTagValue = data.target.value;
    if (this.tagsList?.lengt == 0 || this.tagsList == undefined || this.tagsList == null) {
      return
    }

    let temp = this.tagsList.find(item => { item?.name?.en == this.attributeList[id]._currTagValue });
  }

  isAddRelationShip: boolean = false;
  addRelationShipForm: FormGroup;

  addRelationShip() {
    let data = { 
      from_voter_id: this.voterId, 
      to_voter_id: this.addRelationShipForm.get('to_voter_id').value, 
      // tag: this.addRelationShipForm.get('tag_name').value, 
      relationship_type: this.addRelationShipForm.get('relationship_type').value
    }
    this.http.addRelationship(data).subscribe((res:any)=>{
      if(res.success){
        this.getAttributeList();
        this.addRelationShipForm.reset();
        this.isAddRelationShip = false
      }
    })
  }

  addRelaionModal() {
    this.addRelationShipForm = this.fb.group({
      tag_name: ['', [Validators.required]],
      to_voter_id: ['', [Validators.required]],
      relationship_type: ['', [Validators.required]]
    })
    this.isAddRelationShip = true;
  }

  voters: any = [];
  voter_debounce: any;
  isSelectLoader = { 'voter': false }
  getVoters(key?) {
    this.isSelectLoader['voter'] = true
    if (key) {
      clearTimeout(this.voter_debounce);
      this.voter_debounce = setTimeout(() => {
        let data = { 'end_point': 'FETCH_VOTER_LIST_API_URL' }
        if (key) {
          data['search_param'] = key.target.value
        }
        this.http.getVoterList(data).subscribe((res: any) => {
          if (res.success) {
            this.voters = res.data;
            this.isSelectLoader['voter'] = false

          }
        })
      }, 500);
    } else {
      let data = { 'end_point': 'FETCH_VOTER_LIST_API_URL' }
      this.http.getVoterList(data).subscribe((res: any) => {
        if (res.success) {
          this.voters = res.data;
          this.isSelectLoader['voter'] = false;

        }
      })
    }
  }
}