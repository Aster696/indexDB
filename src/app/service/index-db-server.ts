import { Injectable } from '@angular/core';
import Dexie from 'dexie';

@Injectable({
  providedIn: 'root'
})
export class IndexedDbService {
  private db: Dexie;

  constructor() {
    this.initDatabase();
  }

  private async initDatabase() {
    this.db = new Dexie('VoterDataset');
    this.db.version(1).stores({
      voterData: '++id, data',
      // voterActivityData: '++id, data'
    });

    // Check if the table 'voterData' exists
    const tableExists = await this.tableExists('voterActivityData');

    if (!tableExists) {
      console.log("table not exist")
      // Table doesn't exist, so delete the entire database and recreate
      // await this.deleteDatabase();
      // this.db.close(); // Close the old database instance
      // this.initDatabase(); // Recreate the database
    }
  }

  private async tableExists(tableName: string): Promise<boolean> {
    // Check if the table name exists in the database
    const count = await this.db.table(tableName).where('id').between(0, 1).count();
    return count === 0;
  }

  private async deleteDatabase() {
    // Delete the database
    await Dexie.delete('VoterDataset');
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



}
