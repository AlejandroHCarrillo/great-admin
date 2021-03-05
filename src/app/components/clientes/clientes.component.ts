import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Cliente } from 'src/app/interfaces/cliente';
import { ClientesService } from 'src/app/services/clientes.service';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit {

  clientes: Cliente[] = [];

  constructor(  private router: Router,
                private clientesService: ClientesService) { }

  ngOnInit(): void {
    this.clientesService
    .getClientes()
    .then( ( data : any) => {
      this.clientes = data;
      // console.log(data);      
    });
    
    // this.clientesService.getClientes()
    // .then( (clientes) => { this.clientes = clientes } );
  // .then( (clientes) => { this.clientes = clientes || [] } );
  }

  edit(id?:string){
    console.log("edit: ", id);
    if(id){
      this.router.navigate(['cliente', id]);
    }
    this.router.navigate(['cliente']);
  }

  search( event : any ) {
    console.log("event: ", event);
    
    // this.clientesService
    //   .getClientes()
    //   .then( ( data : any) => {
    //     this.clientes = data;
    //     // console.log(data);        
    // });

  }

}
