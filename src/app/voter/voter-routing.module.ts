import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VoterProfileComponent } from './voter-profile/voter-profile.component';
import { AddEditVoterComponent } from './add-edit-voter/add-edit-voter.component';
import { VoterListComponent } from './voter-list/voter-list.component';

const routes: Routes = [

 

  {
    path: '',
    // canActivate: [NgxPermissionsGuard],
    
    component: VoterListComponent,
    data: {
      parent: 'Voters',
      title:'Voter List ',
      isButton: false,
      isHome: false,
      custom_url:'/voter'
      // headerDisplay: "none",
    }
  },
  {
    path: '',
    // canActivate: [NgxPermissionsGuard],
    data:{
      parent: 'Voters',
      title:'Voter List ',
      custom_url:'/voter'
    },
    children:[
      {
        path: 'add-voter',
        // canActivate: [NgxPermissionsGuard],
        component: AddEditVoterComponent,
        data: {
          parent: 'Voter',
          title:'Add Voter',
          isButton: true,
          isHome: false,
          custom_url:'/add-voter'
        }
      },
      {
        path: 'edit-voter',
        // canActivate: [NgxPermissionsGuard],
        component: AddEditVoterComponent,
        data: {
          title:'Edit Voter',
          parent: 'Voter',
          isButton: false,
          isHome: false,
          custom_url:'/edit-voter'
        }
      },
      {
        path: 'view-profile',
        // canActivate: [NgxPermissionsGuard],
        component: VoterProfileComponent,
        data: {
          title:'Voter Profile',
          parent: 'Voter',
          isButton: true,
          isHome: false,
          custom_url:'/view-profile'
          // headerDisplay: "none",
        }
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VoterRoutingModule { }
