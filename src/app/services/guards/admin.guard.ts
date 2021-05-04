import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { enumRol } from 'src/app/config/enums';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class AdminGuard implements CanActivate {

constructor(public _usuarioService:AuthService,
  public router: Router){
}

  canActivate() {
    if(this._usuarioService.role ===  enumRol.ADMIN )
    {
      console.log("Adelante");      
      return true;
    } else {
      this.router.navigate(['/home']);
      // this._usuarioService.logout();
      console.log("Alto ahi: Bloqueado por el admin guard");      
      return false;
    }
  }
}
