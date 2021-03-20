import { UsuarioService } from "../usuario/usuario.service";
import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";

@Injectable()
export class VerificatokenGuard implements CanActivate {
  
  constructor(public _usuarioService: UsuarioService,
              public router: Router) {}
  
  
  canActivate(): Promise<boolean> | boolean {
    
    console.log("Verificando token");
    let token = this._usuarioService.token;
    
    let payload = JSON.parse(atob(token.split(".")[1]));
    
    let tokenExpirado = this.estaExpirado(payload.exp);
    
    if (tokenExpirado) {
      this.router.navigate(['/login']);
      return false;
    } else {
      // console.log(payload);
      return this.verificaRenovar(payload.exp);
    }
  }
  
  verificaRenovar(fechaExp: number) : Promise<boolean> {
    var horasSinRenovarToken: number = 1;

    return new Promise( (resolve, reject) => {
      let tokenExp = new Date(fechaExp * 1000);
      let ahora = new Date();

      ahora.setTime( ahora.getTime() + ( horasSinRenovarToken *60*60*1000) );

      console.log(tokenExp);
      console.log(ahora);

      if(tokenExp.getTime() > ahora.getTime() ){
        // El tiempo del token esa dentro de las horas sin  renovar token
        resolve(true);
      } else {
        // El token esta proximo a expirar
        this._usuarioService.renuevaToken()
            .then( ()=>( resolve(true) ) )
            .catch( () => { this.router.navigate(['/login']);
                           reject(false); 
            });
      }

    });
  }

  estaExpirado(fechaExp: number) {
    let ahora = new Date().getTime() / 1000;

    if (fechaExp < ahora) {
      return true;
    } else {
      return false;
    }
  }
}