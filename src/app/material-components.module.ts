import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {A11yModule} from '@angular/cdk/a11y';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {CdkStepperModule} from '@angular/cdk/stepper';
import {MatToolbarModule,} from '@angular/material/toolbar';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatChipsModule} from '@angular/material/chips'
import {MatIconModule} from '@angular/material/icon';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MatButtonModule, MatSidenavModule, MatRippleModule} from '@angular/material';
import {MatBadgeModule} from '@angular/material/badge';
import {MatMenuModule} from '@angular/material/menu';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatListModule} from '@angular/material/list';
import {MatRadioModule} from '@angular/material/radio';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatDividerModule} from '@angular/material/divider';
import {MatTabsModule} from '@angular/material/tabs';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatStepperModule} from '@angular/material/stepper';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatDialogModule} from '@angular/material/dialog';
import {DateAdapter, MAT_DATE_FORMATS , MAT_DATE_LOCALE} from '@angular/material'
// import {MaterialPersianDateAdapter , PERSIAN_DATE_FORMATS} from './modules/shared/components/other/persian-datepicker/material.persian-date.adapter';
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    FlexLayoutModule,
    MatBadgeModule,
    MatMenuModule,
    MatSidenavModule,
    MatSlideToggleModule,
    MatListModule,
    MatRadioModule,
    MatExpansionModule,
    MatTooltipModule,
    MatDividerModule,
    MatTabsModule,
    MatDatepickerModule,
    MatStepperModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatProgressBarModule,
    MatDialogModule,
    MatRippleModule,
    DragDropModule
  ],
  exports: [
    A11yModule,
    CdkStepperModule,
    MatIconModule,
    MatToolbarModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    FlexLayoutModule,
    MatBadgeModule,
    MatMenuModule,
    MatSidenavModule,
    MatSlideToggleModule,
    MatListModule,
    MatRadioModule,
    MatExpansionModule,
    MatTooltipModule,
    MatDividerModule,
    MatTabsModule,
    MatDatepickerModule,
    MatStepperModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatProgressBarModule,
    MatDialogModule,
    MatRippleModule,
    DragDropModule
  ],
  providers:[
    // {provide:DateAdapter,useClass:MaterialPersianDateAdapter,deps:[MAT_DATE_LOCALE]},
    // {provide:MAT_DATE_FORMATS,useValue:PERSIAN_DATE_FORMATS}
  ]
})
export class MaterialComponentsModule { }
