import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { AuthService } from '../auth/auth.service';

@Injectable()
export class LoginGuard implements CanActivate {

  constructor(
    public _usuarioService: AuthService,
    public router: Router
  ) {}

  canActivate() {

    if ( this._usuarioService.estaLogueado() ) {
      return true;
    } else {
      console.log( 'Bloqueado por guard' );
      this.router.navigate(['/login']);
      return false;
    }

  }
}