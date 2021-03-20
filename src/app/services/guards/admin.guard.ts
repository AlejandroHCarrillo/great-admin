import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UsuarioService } from '../usuario/usuario.service';

@Injectable()
export class AdminGuard implements CanActivate {

constructor(public _usuarioService:UsuarioService){
}

  canActivate() {
    if(this._usuarioService.usuario.role === 'ADMIN_ROLE' )
    {
      console.log("Adelante");      
      return true;
    } else {
      this._usuarioService.logout();
      console.log("Alto ahi: Bloqueado por el admin guard");      
      return false;
    }
  }
}
