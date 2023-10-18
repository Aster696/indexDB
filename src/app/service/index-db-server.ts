import { Injectable } from '@angular/core';
import Dexie from 'dexie';

@Injectable({
  providedIn: 'root'
})
export class IndexedDbService {
  private db: Dexie;

  constructor() {
    // this.initDatabase();
    this.db = new Dexie('VoterDataset');
    this.db.version(1).stores({
      voterData: '++id, data',
      voterActivityData: '++id, data'
    });
  }

  // private initDatabase() {
  //   this.db = new Dexie('VoterDataset');
  //   this.db.version(1).stores({
  //     voterData: 'id, data'
  //   });
  // }

  saveData( data: any) {
    return this.db.table("voterData").put({ data });
  }

  getData(id: number, pageSize: any) {
    return this.db.table("voterData")
    .offset(id)
    .limit(pageSize)
    .toArray();
  }

  getAllData() {
    return this.db.table("voterData").toArray();
  }

  ////////////// offline activity /////////////////
  storeActivityData(data: any){
    return this.db.table("voterActivityData").put({ data });
  }

  getOfflineActivityData() {
    return this.db.table("voterActivityData").toArray();
  }

  deleteOfflineActivityData(id: number){
    return this.db.table("voterActivityData").delete(id);
  }

  searchDataByProperty(propertyName: any, valueToMatch: any) {
    return this.db.table("voterData").where(propertyName).equals(valueToMatch).toArray();
  }
  


}
