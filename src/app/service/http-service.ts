import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private url = 'https://api.chatiyc.com'; // Replace with your API URL

  constructor(private http: HttpClient) { }

  getData(): Observable<any> {
    console.log("something")
    return this.http.get(this.url);
  }

  public getVoterList(data?) {
    return this.http.get(this.url + `/social_media/v1/post-detail/get-data-from-background`, { params: data })
  }

  
}