import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VoterRoutingModule } from './voter-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzTimePickerModule } from 'ng-zorro-antd/time-picker';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzSliderModule } from 'ng-zorro-antd/slider';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { VoterListComponent } from './voter-list/voter-list.component';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { VoterProfileComponent } from './voter-profile/voter-profile.component';
import { AddEditVoterComponent } from './add-edit-voter/add-edit-voter.component';
import { PrimaryAttributesComponent } from './voter-profile/primary-attributes/primary-attributes.component';
import { RelationshipMappingComponent } from './voter-profile/relationship-mapping/relationship-mapping.component';

@NgModule({
  declarations: [
    VoterProfileComponent,
    AddEditVoterComponent,
    VoterListComponent,
    PrimaryAttributesComponent,
    RelationshipMappingComponent
  ],
  imports: [
    CommonModule,
    VoterRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NzFormModule,
    NzButtonModule,
    NzAvatarModule,
    NzIconModule,
    NzTabsModule,
    NzStepsModule,
    NzDividerModule,
    NzCardModule,
    NzDrawerModule,
    NzDropDownModule,
    NzSelectModule,
    NzDatePickerModule,
    NzInputModule,
    NzTimePickerModule,
    NzTagModule,
    NzSliderModule,
    NzTableModule,
    NzUploadModule,
    NzPageHeaderModule,
    NzCollapseModule,
    NzToolTipModule,
    NzSpinModule,
    NzModalModule,
    NzListModule,
    NzPaginationModule,
    NzBadgeModule
  ]
})
export class VoterModule { }
