import { Component, Input, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { GlobalService } from 'src/app/service/global.service';
import { ApiService } from 'src/app/service/http-service';

@Component({
  selector: 'app-primary-attributes',
  templateUrl: './primary-attributes.component.html',
  styleUrls: ['./primary-attributes.component.css']
})
export class PrimaryAttributesComponent implements OnInit {
  @Input() voterId;

  @Input() attributeList:any = [];
  constructor(private http:ApiService, private message : NzMessageService, private global: GlobalService) { }

  ngOnInit(): void {
    this._currLanguage = localStorage.getItem("appLanguage") || 'en';
    if(this.voterId && !this.attributeList){
      let count = 1;
      this.getAttributeList();
      count++;
    }
  }

  _currLanguage : any;
  getAttributeList(keyword?){
    let data = {  "voter_id":this.voterId }
    this.http.getRelationshipTags(data).subscribe((res:any)=>{
      if(res.success){
        this.attributeList = res.data;
        this.attributeList.forEach(element=>{
          element['_currTagValue'] = "";
          element['_isVisible'] = false;
        });
      }
    })
  }

  debounce: any;
  tagsList : any;
  _currPrimaryAttributeID : any;
  getTagLIst(isSearch?, key?){
    let data = {  "model_name":"TagMaster" }
    clearTimeout(this.debounce);
    this.debounce = setTimeout(() => {
      this.http.getMasterData(data).subscribe((res:any)=>{
        if(res.success){
          this.tagsList = res.data
        }
      })
    }, 500);
   
  }

  isTagAdded: boolean = false
  addTagForAttribute(data, i){
    this.isTagAdded = true
    this.attributeList[i]._isVisible = true;
    let param = {"voter_id":[this.voterId],"primary_attribute":data?.id, "tag":data?._currTagValue,
      "device_details": this.global.location
    };
    this.http.addVoterTasg(param).subscribe((res:any)=>{
      if(res.success){
        this.message.success(res.message);
        this.getAttributeList();
        this.attributeList[i]._isVisible = false;
      }else{
        // this.message.error(res.message);
        this.attributeList[i]._isVisible = false;
      }
      this.isTagAdded = false
    })
  }

  test(data,id){
    this.attributeList[id]._currTagValue = data.target.value;
    if(this.tagsList?.lengt == 0 || this.tagsList == undefined || this.tagsList == null){
      return
     }

    let temp  = this.tagsList.find(item=>{  item?.name?.en == this.attributeList[id]._currTagValue }) ;
  }

  isPresent:boolean = false;
}
