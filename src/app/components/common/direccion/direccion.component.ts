import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedService } from 'src/app/services/shared.service';
import { isInvalidControl } from '../../../helpers/tools'

@Component({
  selector: 'app-direccion',
  templateUrl: './direccion.component.html',
  styleUrls: ['./direccion.component.css']
})
export class DireccionComponent implements OnInit {
  @Input() fgroup : FormGroup = new FormGroup({});
  // fgroup : FormGroup = new FormGroup({});

  results: string[] = [];
  states: string[] = [];

  isInvalidControl = isInvalidControl;
  constructor(  private fb: FormBuilder,
                private myService :  SharedService ) { }

  ngOnInit(): void {
    this.myService
    .getEstados()
    .then( ( data : any) => {        
      this.states = data;        
    });

  }

  search( event : any ) {
    this.myService
      .getColonias(event.query)
      .then( ( data : any) => {
        this.results = data;        
    });
  }

  crearFormulario(){
    this.fgroup = this.fb.group({
      callenumero: ['', [Validators.required]],
      colonia: ['', [Validators.required]],

      municipio: ['', [Validators.required]],
      estado: ['', [Validators.required]],
      codigopostal: ['', [Validators.required]]
    });
  }

}
