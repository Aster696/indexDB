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
      voterData: 'id, data'
    });
  }

  // private initDatabase() {
  //   this.db = new Dexie('VoterDataset');
  //   this.db.version(1).stores({
  //     voterData: 'id, data'
  //   });
  // }

  saveData(id: number, data: any) {
    return this.db.table("voterData").put({ id, data });
  }

  getData(id: number) {
    return this.db.table("voterData").get(id);
  }

  getAllData() {
    return this.db.table("voterData").toArray();
  }
}
