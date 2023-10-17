import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  globalUserPermissionsData = new ReplaySubject<any>();
  private url = 'https://api.chatiyc.com'; // Replace with your API URL

  constructor(private http: HttpClient) { }

  getData(): Observable<any> {
    console.log("something")
    return this.http.get(this.url);
  }

  public setPermissionValue(data): any {
    this.globalUserPermissionsData.next(data);
  }

  public UserLoginSendOTP(data, end_point): any {
    const headers = new HttpHeaders();
    return this.http.post(this.url + end_point, data, { headers: headers });
  }

  // verify OTP
  public verifyOTPAPI(data, end_point): any {
    const headers = new HttpHeaders();
    return this.http.post(this.url + end_point, data, { headers: headers });
  }

  // public createOnline$() {
  //   return merge<boolean>(
  //     fromEvent(window, 'offline').pipe(map(() => false)),
  //     fromEvent(window, 'online').pipe(map(() => true)),
  //     new Observable((sub: Observer<boolean>) => {
  //       sub.next(navigator.onLine);
  //       sub.complete();
  //     })
  //   );
  // }

  // verify User API
  public verifyUserAPI(end_point): any {
    return this.http.get(this.url + end_point);
  }

  public getUserDetails() {
    return this.http.get(`${this.url}/users/v1/auth/verify-user`)
  }

  public editUserDetails(formData: any) {
    return this.http.post(`${this.url}/users/v1/auth/edit-user-profile`, formData)
  }

  // logout user
  public logoutUserAPI(end_point): any {
    const headers = new HttpHeaders();
    return this.http.get(this.url + end_point, { headers: headers });
  }

  public getDataFromBackgroundFunction(params_data) {
    return this.http.get(this.url + `/social_media/v1/post-detail/get-data-from-background`, { params: params_data });
  }

  public addVoterToList(data) {
    return this.http.post(this.url + `votes/add-enroller-votes`, data);
  }

  public getGlobalMaster(data, search_param?) {
    return this.http.get(this.url + `master/get-global-master/${data}`, { params: search_param });
    // master/get-global-master/:modelname
  }
  public vouchersList(data) {
    return this.http.get(this.url + 'account/get-account-list', { params: data })
  }

  public getGlobalUser(user, data?) {

    return this.http.get(this.url + 'users/get-global-user/' + user, { params: data })
  }

  public paymentOnCommission(data) {
    return this.http.post(this.url + `votes/payment-enroller-votes`, data);
    // votes/payment-enroller-votes
  }
  // votes/add-enroller-votes
  public addEditVoucher(data) {
    return this.http.post(this.url + 'account/add-account', data)
  }

  public addEnroller(data) {
    return this.http.post(this.url + 'users/add-enroller', data)
  }

  public exportMaster(type) {
    return this.http.get(this.url + 'account/export/' + type, { responseType: 'blob' })
  }

  public addExpenseLedger(type, data) {
    return this.http.post(this.url + 'account/add-' + type + '-type', data)
  }

  public deleteAccount(id) {
    return this.http.delete(this.url + 'account/delete-account/' + id)
  }

  public logout() {
    return this.http.get(this.url + '/users/v1/auth/logout-user')
  }

  public getEnrollerData(data) {
    return this.http.get(this.url + 'users/get-global-user/Enroller', { params: data })
  }

  public editEnrollerData(id, data) {
    return this.http.put(this.url + 'users/edit-enroller/' + id, data)
  }

  public getOtpForEnroller(data) {
    return this.http.post(this.url + 'users/iyc/send-otp', data)
  }

  public verifyOtpForEnroller(data) {
    return this.http.post(this.url + 'users/iyc/verify-otp', data)
  }

  public getDashboardApiCount() {
    return this.http.get(this.url + 'votes/get-total-counts')
  }

  public getDashboardGraphCount(data) {

    return this.http.get(this.url + 'votes/get-realtime-graph-data', { params: data })
  }

  public getDashboardTableData() {
    return this.http.get(this.url + 'votes/get-analytic-data')
  }

  public getAssemblyDashboard(data?) {
    return this.http.get(this.url + 'votes/get-assembly-candidate', { params: data })
  }

  public getDashboardMetrics4() {
    return this.http.get(this.url + '/social_media/v1/post-detail/get-data-from-background');
  }

  public getDistrictWiseData() {
    return this.http.get(this.url + 'votes/get-district-candidate')
  }

  public getGSCandidateData(data?) {
    return this.http.get(this.url + 'votes/get-gs-candidate', { params: data })
  }

  public getOurGraphData(data) {
    return this.http.get(this.url + 'votes/get-our-graph-data', { params: data })
  }

  public getDailyVoteCount(data) {
    return this.http.get(this.url + 'votes/get-day-wise-vote-count', { params: data })
  }

  public getInsightVotesGraph(data) {
    return this.http.get(this.url + 'votes/get-vote-insight-graph', { params: data })
  }

  public exportMasterAPIWithMultipleFilters(data) {
    return this.http.post(this.url + 'account/export-analytics-report', data, { responseType: 'blob' })
  }

  public generateDayWiseReport(data) {
    return this.http.post(this.url + 'account/generate-day-wise-report', data, { responseType: 'blob' })
  }
  public generateDayWiseReportAssemblyDistrict(data) {
    return this.http.post(this.url + 'account/generate-day-wise-district-assembly-report', data, { responseType: 'blob' })
  }

  public getDistrictVotes() {
    return this.http.get(this.url + 'votes/get-district-votes')
  }

  public getAssemblyVotes() {
    return this.http.get(this.url + 'votes/get-assembly-votes')
  }

  public getSPVotes() {
    return this.http.get(this.url + 'votes/get-candidate-votes')
  }

  // Phase 2 PWA APIs
  public getVoterActivity(data) {
    return this.http.get(this.url + '/voters/v1/voter-activity/get-voter-activity', { params: data })
  }

  public deleteVoterActivity(id) {
    return this.http.delete(this.url + '/voters/v1/voter-activity/delete-voter-activity/' + id + '/')
  }

  public editVoterActivity(id, data) {
    return this.http.put(this.url + '/voters/v1/voter-activity/edit-voter-activity/' + id + `/`, data)
  }

  public addVoterActivity(data) {

    return this.http.post(this.url + `/voters/v1/voter-activity/add-voter-activity`, data)
  }



  public getVoterFollowup(data) {
    return this.http.get(this.url + '/voters/v1/voter-activity/get-voter-activity', { params: data })
  }

  public deleteVoterFollowup(id) {
    return this.http.delete(this.url + '/voters/v1/voter-activity/delete-voter-activity/' + id + '/')
  }

  public editVoterFollowup(id, data) {
    return this.http.put(this.url + `/voters/v1/voter-followup/edit-voter-followup/` + id + `/`, data)
  }

  public addVoterFollowup(data) {
    return this.http.post(this.url + `/voters/v1/voter-followup/add-voter-followup`, data)
  }


  public logOutUser() {
    return this.http.get(this.url + `/users/v1/auth/logout-user`);
  }


  // Get User Profile Details
  public getUserProfile(data) {
    return this.http.get(this.url + `/users/v1/auth/get-user-profile`, { params: data })
  }

  public getGlobalAdminData(data) {
    return this.http.get(this.url + `/users/v1/user/add-global-account`, { params: data })
  }

  public addGlobalAdminData(data) {
    return this.http.post(this.url + `/users/v1/user/add-global-account`, data)
  }


  public getVoterList(data) {
    return this.http.get(this.url + `/social_media/v1/post-detail/get-data-from-background`, { params: data })
  }

  public getVoterDetails(data) {
    return this.http.get(this.url + `/social_media/v1/post-detail/get-data-from-background`, { params: data })
  }

  public putVoterFacebookLink(id: any, formData: any) {
    return this.http.put(`${this.url}/voters/v1/voter-data/edit-voter-data/${id}/`, formData)
  }

  public addEditVoterActivityList(data) {
    return this.http.get(this.url + `/voters/v1/voter-activity/get-voter-activity`, { params: data })
  }


  public getVoterFollowUp(data) {
    return this.http.get(this.url + `/voters/v1/voter-followup/get-voter-followup`, { params: data })
  }

  public getMasterData(data) {
    return this.http.get(this.url + `/master/v1/master-get/get-master-data-global`, { params: data })
  }

  getUserActivityHistory(data?) {
    return this.http.get(`${this.url}/platform_central/v1/audit-trail/get-global-history`, {params: data})
  }

  // Rating voter
  public getVoterRating(data) {
    return this.http.get(this.url + `/master/v1/master-get/get-master-data-global`, { params: data })
  }

  public addVoterRating(data) {
    return this.http.get(this.url + `/voters/v1/voter-rating/add-voter-rating`, { params: data })
  }


  public editVoterRating(id, data) {
    // data= {voter_id,  rating}
    return this.http.put(this.url + `/voters/v1/voter-rating/edit-voter-rating/` + id + `/`, { params: data })
  }

  public deleteoterRating(id) {
    return this.http.delete(this.url + `/voters/v1/voter-rating/delete-voter-rating/` + id + `/`)
  }


  public editVoter(id, data) {
    return this.http.put(this.url + `/voters/v1/voter-data/edit-voter-data/` + id + `/`, data)
  }

  public addVoter(data) {
    return this.http.post(this.url + `/voters/v1/voter-data/add-voter-data`, data)
  }

  public getVoterStatus(data) {
    return this.http.get(this.url + `/master/v1/master-get/get-master-data-global`, data)
  }

  public getAuditTrail(data) {
    return this.http.get(this.url + `/platform_central/v1/audit-trail/get-audit-trail`, { params: data })
  }

  // Task Management

  public getTaskList(data) {
    return this.http.get(this.url + `/users/v1/task-management/fetch-task-list`, { params: data })
  }

  public editTasks(id, data) {
    return this.http.put(this.url + `/users/v1/task-management/edit-task/` + id + `/`, data)
  }

  public addTasks(data) {
    return this.http.post(this.url + `/users/v1/task-management/create-task`, data)
  }

  public changeTaskStatus(id, data) {
    return this.http.put(this.url + `/users/v1/task-management/edit-task/` + id + `/`, data)
  }


  // Team Management
  public getTeamList(data) {
    return this.http.get(this.url + `/users/v1/user-management/get-user`, { params: data })
  }

  public editTeamMember(id, data) {
    return this.http.put(this.url + `/users/v1/user-management/edit-user/` + id + `/`, data)
  }

  public addTeamMember(data) {
    return this.http.post(this.url + `/users/v1/user-management/add-user`, data)
  }

  public changeTeamStatus(id, data) {
    return this.http.post(this.url + `/users/v1/user-management/change-user-status`, data)
  }

  public importTask(data) {
    return this.http.post(this.url + `/users/v1/task-management/import-task`, data)
  }

  public getAccountListt(data) {
    return this.http.get(this.url + `/social_media/v1/account-link/get-account-links`, { params: data })
  }

  public editAccountList(id, data) {
    return this.http.put(this.url + `/social_media/v1/account-link/edit-account-links/` + id + `/`, data)
  }

  public addAccountLink(data) {
    return this.http.post(this.url + `/social_media/v1/account-link/add-account-links`, data)
  }

  public changeLanguage(data) {
    return this.http.post(this.url + `/users/v1/user/change-user-language`, data)
  }

  public addVoterTasg(data) {
    return this.http.post(this.url + `/voters/v1/voter-tag/add-voter-tag`, data)
  }


  public getVotersTagList(data) {
    return this.http.get(this.url + `/voters/v1/voter-tag/get-voter-tag`, { params: data })
  }

  public addRelationship(data) {
    return this.http.post(this.url + `/voters/v1/voter-tag/add-voter-relationship`, data)
  }


  public getRelationshipTags(data) {
    return this.http.get(this.url + `/voters/v1/voter-tag/get-voter-primary-attributes`, { params: data })
  }

  public getRelationList(data) {
    return this.http.get(this.url + `/voters/v1/voter-tag/get-voter-relationship`, { params: data })
  }

  public getSubDomainData(data) {
    return this.http.get(this.url + `/users/v1/user/fetch-global-account-from-code`, { params: data })
  }

  getLeaderTaskList(data) {
    return this.http.get(this.url + '/users/v1/leader-schedule/get-leader-schedule', { params: data })
  }

  public addLeaderTasks(data) {
    return this.http.post(this.url + `/users/v1/leader-schedule/create-leader-schedule`, data)
  }

  public editLeaderTasks(id, data) {
    return this.http.put(this.url + `/users/v1/leader-schedule/edit-leader-schedule/${id}/`, data)
  }

  // boot api
  getBoothList(data?: any) {
    return this.http.get(`${this.url}/booth-profile/v1/import/get-source-file`, { params: data })
  }

  getBoothMapping(data?: any) {
    return this.http.get(`${this.url}/master/v1/booth/fetch-booth-mapping`, {params: data})
  }

  postBooth(formData: FormData) {
    return this.http.post(`${this.url}/booth-profile/v1/import/import-source-file`, formData)
  }

  getBoothDevelopmentWorks(data?: any) {
    return this.http.get(`${this.url}/booth-profile/v1/list/fetch-tab-list?model_name=DevelopmentWork`, {params: data})
  }

  getBoothRequestsAavedan(data?: any) {
    return this.http.get(`${this.url}/booth-profile/v1/list/fetch-tab-list?model_name=RequestAavedan`, {params: data})
  }

  // analitic report
  getMostActiveUsers(data?: any) {
    return this.http.get(`${this.url}/master/v1/analytics-report/get-most-active-users`, {params: data})
  }

  getMostActiveBooths(data?: any) {
    return this.http.get(`${this.url}/master/v1/analytics-report/get-most-active-booth`, {params: data})
  }


  
}