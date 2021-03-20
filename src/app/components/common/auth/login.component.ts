import { NgForm } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/services.index';
import { Usuario } from 'src/app/models/usuario.model';

function init_plugins(){};
declare const gapi: any;
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  email: string = "";
  recuerdame: boolean = false;

  auth2: any;

  constructor(
    public router: Router,
    public authService: AuthService
  ) { }

  ngOnInit() {
    init_plugins();
    this.googleInit();

    this.email = localStorage.getItem('email') || '';
    if ( this.email.length > 1 ) {
      this.recuerdame = true;
    }

  }

  googleInit() {
    gapi.load('auth2', () => {
      this.auth2 = gapi.auth2.init({
        client_id: '442737206823-dilej5tevnrv61sovd7bocf5qeafmjs3.apps.googleusercontent.com',
        cookiepolicy: 'single_host_origin',
        scope: 'profile email'
      });
      this.attachSignin( document.getElementById('btnGoogle') );
    });
  }

  attachSignin( element : any) {
    this.auth2.attachClickHandler( element, {}, (googleUser:any) => {

      // let profile = googleUser.getBasicProfile();
      let token = googleUser.getAuthResponse().id_token;

      this.authService.loginGoogle( token )
          .then( () => window.location.href = '#/home' );
          
    });
  }

  ingresar( forma: NgForm) {
    if ( forma.invalid ) {
      return;
    }

    let usuario = new Usuario("", forma.value.email, forma.value.password );
    this.authService.login( usuario, forma.value.recuerdame )
    .then((correcto:any) => this.router.navigate(['/home']));

      // .subscribe( (correcto:any) => this.router.navigate(['/dashboard'])  );
    // this.router.navigate([ '/dashboard' ]);

  }

}