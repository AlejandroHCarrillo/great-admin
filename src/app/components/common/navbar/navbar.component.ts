import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/services.index';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  usuario = {
    email: "",
    nombre: "Invitado",
    role: "GUEST_ROLE",
    username: "guest"
  }

  constructor( private authService : AuthService, 
               private router: Router                
    ) { }

  ngOnInit(): void {
    this.getUsuario();
  }

  signOut(){
    this.authService.logout();
  }

  getUsuario(){
    let user = localStorage.getItem("usuario");
    if(user){
      this.usuario =  JSON.parse(user);
    } else{
      console.log("TODO: Usuario no loggeado. invitarlo a salir");
    this.router.navigate([`login`]);

    }
  }
}
