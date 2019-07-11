import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';

export interface DialogData{
  node: string,
  permissionsObj: PermissionObj,
  isConditional:boolean
}

export interface PermissionObj{
  review:any,
  notif:any
}

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {

  reviewPermission:any[];
  notifPermission:any[];
  permissionsObj= {
    review:null,
    notif:null
  };
  
  constructor(
    public dialogRef: MatDialogRef<ModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    console.log(data)
  } 
  disableRipple: boolean = true;

  ngOnInit() {
    this.reviewPermission=[
      {name:'مجوز1',id:'0'},
      {name:'مجوز2',id:'1'},
      {name:'مجوز3',id:'2'},
      {name:'مجوز4',id:'3'},
    ]
    this.notifPermission=[
      {name:'مجوز1',id:'0'},
      {name:'مجوز2',id:'1'},
      {name:'مجوز3',id:'2'},
      {name:'مجوز4',id:'3'},
    ]
  }

  saveConfig(){

  }

  setReviewPermissions(e){
    // this.reviewPermission = e;
    // this.permissionsObj.review = e;
    this.data.permissionsObj.review = e;
  }

  setNotifPermissions(e){
    // this.notifPermission = e;
    // this.permissionsObj.notif = e;
    this.data.permissionsObj.notif = e;
  }

  onCancelClicked()
  {
    this.dialogRef.close();
  }
}
