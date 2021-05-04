import { Component, OnInit } from '@angular/core';
import { checkRole } from 'src/app/helpers/tools';
import { Usuario } from 'src/app/models/usuario.model';
import { AuthService } from 'src/app/services/services.index';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  checkRole = checkRole;
  usuario: Usuario = new Usuario("", "", "");

  constructor( private auth: AuthService ) { 

  }

  ngOnInit(): void {
    this.usuario = this.auth.usuario;
    console.log(this.usuario);    
  }


}
