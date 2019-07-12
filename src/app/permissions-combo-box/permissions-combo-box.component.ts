import { Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { SelectItem } from 'primeng/api';

@Component({
  selector: 'permissions-combo-box',
  templateUrl: './permissions-combo-box.component.html',
  styleUrls: ['./permissions-combo-box.component.css'],
  providers:[]
})
export class PermissionsComboBoxComponent implements OnInit, OnChanges {

  @Input() label:string;
  @Output() changed = new EventEmitter<any>();
  
  permissions: SelectItem[];
  selectedPermission: any[];  
  constructor(
    ) {
    this.permissions=[
      {label:'مجوز1',value:'0'},
      {label:'مجوز2',value:'1'},
      {label:'مجوز3',value:'2'},
      {label:'مجوز4',value:'3'},
    ]
   }
  
  ngOnInit() {
  }

  ngOnChanges(changes : SimpleChanges){
    console.log(changes);
  }

  permissionChanged(e){
    console.log(e)
    this.changed.emit(e.value)
  }


}
