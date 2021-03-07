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
    .then(async (resp)=>{
      const body = await resp.json();
      this.clientes = body.clientes;
    })
    .catch((e)=>{
        console.log("error: ", e);            
    });

  }

  edit(id?:string){
    // console.log("edit: ", id);
    this.router.navigate([`cliente/${id}`]);
  }

  delete(cliente:any){
    alert("eliminar:" + cliente.nombre);

    this.clientesService.delete(cliente._id);

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
