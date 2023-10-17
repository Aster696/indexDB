import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Error1Component } from './authentication/error-1/error-1.component';
import { AuthGuard } from './service/auth.guard';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/voter' },
  { path: 'authentication', loadChildren: () => import('./authentication/authentication.module').then(m => m.AuthenticationModule) },
  { path: 'voter', loadChildren: () => import('./voter/voter.module').then(m => m.VoterModule), canActivate: [AuthGuard] },
  {
    path:'**',
    component: Error1Component
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
