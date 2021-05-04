import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';

import { AuthService } from '../auth/auth.service';

@Injectable()
export class LoginGuard implements CanActivate {

  constructor(
    public _usuarioService: AuthService
  ) {}

  canActivate() {
    console.log("estaLogueado?", this._usuarioService.estaLogueado());    
    if ( this._usuarioService.estaLogueado() ) {
      return true;
    } else {
      this._usuarioService.logout();
      // console.log( 'Bloqueado por guard' );
      // this.router.navigate(['/login']);
      return false;
    }

  }
}