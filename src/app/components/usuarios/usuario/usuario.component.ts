import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { SharedService } from 'src/app/services/shared.service';
import { DropDownItem } from '../../../interfaces/drop-down-item';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent implements OnInit {

  usuarioForm: FormGroup = new FormGroup({
    nombre: new FormControl(),
    aPaterno: new FormControl(),
    aMaterno: new FormControl(),
    email:  new FormControl(),
  });

  showDatepicker : boolean = false;

  sexo = 'M';
  fechaNacimiento = new Date();
  fechaIngreso = new Date();

  states: DropDownItem[] = [];
  selectedState : DropDownItem = { name: "", code: ""};

  colonia: string = "";
  results: string[] = [];

  tCelular: string = "";
  tCasa: string = "";
  tTrabajo: string = "";

  rfc: string = "";



  constructor(  private fb : FormBuilder,
                private myService :  SharedService ) {
    this.crearFormulario();
  }

  ngOnInit(): void {
      this.myService
      .getEstados()
      .then( ( data : any) => {        
        this.states = data;        
      }); 

    }

  search( event : any ) {
    // console.log("event: ", event);
    
    this.myService
      .getColonias(event.query)
      .then( ( data : any) => {
        this.results = data;
        // console.log(data);
        
    });
  }

  handleDropdown( event : any ) {
    //event.query = current value in input field
  } 

  crearFormulario(){
    this.usuarioForm = this.fb.group({
      nombre: ['Alejandro' ],
      aPaterno: ['Hernandez'],
      aMaterno: ['Carrillo'],
      email: ['abc@def.com'],
    });
  }

  guardar(){
    console.log("Guardar formulario usuarios");
    console.log(this.usuarioForm);
    
  }
  
}
