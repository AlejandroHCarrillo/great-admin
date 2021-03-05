import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.css']
})
export class ClienteComponent implements OnInit {
  results: string[] = [];
  states: string[] = [];

  form : FormGroup = new FormGroup({});

  foo : FormControl = new FormControl();
  dueDate : FormControl = new FormControl();
  
  constructor(  private fb: FormBuilder,
                private myService :  SharedService  ){}

   ngOnInit() {
     this.initFormGroup();

     this.myService
     .getEstados()
     .then( ( data : any) => {        
       this.states = data;        
     }); 

   }

  initFormGroup() {
    this.foo= this.fb.control('', Validators.required);
    this.dueDate = this.fb.control('', Validators.required);

    this.form = this.fb.group({
      // foo: this.foo,
      // dueDate : this.dueDate,

      nombre: new FormControl('Alejandro', Validators.required),
      apaterno: new FormControl('Hernandez', Validators.required),
      amaterno: new FormControl('Carrillo'),

      fechaNacimiento: new FormControl('04/04/1977', Validators.required),
      rfc: new FormControl('xxxx-xxxxxx-xxx'),
      fechaIngreso: new FormControl('01/01/2020', Validators.required),

      matricula: new FormControl('0987654345678'),
      curp: new FormControl('xxxx-xxxx-xxx-xxx'),
      sexo: new FormControl('M', Validators.required),

      callenumero: new FormControl('chetumal 20', Validators.required),
      colonia: new FormControl('conocida', Validators.required),

      municipio: new FormControl('x', Validators.required),
      estado: new FormControl('x', Validators.required),
      codigopostal: new FormControl('x', Validators.required),

      tcelular: new FormControl('', Validators.required),
      tcasa: new FormControl(''),
      ttrabajo: new FormControl(''),

      email: new FormControl('', Validators.required),
      notas: new FormControl(''),

    });

  }

  getFormControl(name: any){
    return this.form.get(name);
  }

  submitParams(){
    console.log("submitingParams...");
    console.log(this.form.value);
    
    try{
    let params = {
      "foo": this.form.get('foo')?.value || "",
      "duedate": this.form.get('duedate')?.value || ""
    };
    // logic to call service  
    } catch(e){
      console.log(e);
      
    }
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

}
