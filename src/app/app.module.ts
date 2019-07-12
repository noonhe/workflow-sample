import { BrowserModule } from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MaterialComponentsModule } from './material-components.module';
import { PrimengComponentsModule } from './primeng-components.module';
import { WorkflowDesignerComponent } from './workflow-designer/workflow-designer.component';
import { ModalComponent } from './workflow-designer/modal/modal.component';
import { PermissionsComboBoxComponent } from './permissions-combo-box/permissions-combo-box.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    WorkflowDesignerComponent,
    ModalComponent,
    PermissionsComboBoxComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialComponentsModule,
    PrimengComponentsModule,
  ],
  entryComponents:[ModalComponent],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
