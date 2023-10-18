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
      voterActivityData: '++id, data'
    });

    // Check if the table 'voterData' exists
    const tableExists = await this.tableExists('voterActivityData');

    if (!tableExists) {
      console.log("table not exist")
      // Table doesn't exist, so delete the entire database and recreate
      await this.deleteDatabase();
      this.db.close(); // Close the old database instance
      this.initDatabase(); // Recreate the database
    }
  }

  private async tableExists(tableName: string): Promise<boolean> {
    try{
      // Check if the table name exists in the database
      const count = await this.db.table(tableName).where('id').between(0, 1).count();
      return true;
    } catch (error){
      return false
    }
    
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
