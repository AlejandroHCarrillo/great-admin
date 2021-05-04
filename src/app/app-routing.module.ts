import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PagesComponent } from './components/pages/pages.component';

import { ClienteComponent } from './components/clientes/cliente/cliente.component';
import { ClientesComponent } from './components/clientes/clientes.component';
import { LoginComponent } from './components/common/auth/login.component';
import { RegisterComponent } from './components/common/auth/register.component';
import { NopagefoundComponent } from './components/common/nopagefound/nopagefound.component';
import { HomeComponent } from './components/home/home.component';
import { ProductoComponent } from './components/productos/producto/producto.component';
import { ProductosComponent } from './components/productos/productos.component';
import { UsuarioComponent } from './components/usuarios/usuario/usuario.component';
import { UsuariosComponent } from './components/usuarios/usuarios.component';
import { CatalogosComponent } from './components/catalogos/catalogos.component';
import { VentasComponent } from './components/ventas/ventas.component';
import { AlumnosComponent } from './components/alumnos/alumnos.component';
import { AlumnoComponent } from './components/alumnos/alumno/alumno.component';
import { CajaComponent } from './components/caja/caja.component';
import { InscripcionesComponent } from './components/inscripciones/inscripciones.component';
import { CiclosEscolaresComponent } from './components/ciclos-escolares/ciclos-escolares.component';
import { CursosComponent } from './components/cursos/cursos.component';
import { CursoComponent } from './components/cursos/curso/curso.component';
import { IncripcionesReportComponent } from './components/inscripciones/incripciones-report/incripciones-report.component';
import { EstadoCuentaComponent } from './components/estado-cuenta/estado-cuenta.component';
import { CargosComponent } from './components/cargos/cargos.component';
import { CargosReportComponent } from './components/cargos/cargos-report/cargos-report.component';
import { PagosReportComponent } from './components/pagos/pagos-report/pagos-report.component';
import { EstadoCuentaMailComponent } from './components/estado-cuenta/estado-cuenta-mail/estado-cuenta-mail.component';
import { EstadoCuentaListComponent } from './components/estado-cuenta/estado-cuenta-list/estado-cuenta-list.component';
import { AdminGuard } from './services/services.index';

const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},

  // Rutas protegidas
  { path: '', 
    component: PagesComponent, 
    children: [
      {path: 'home', component: HomeComponent},
      {path: 'catalogos', component: CatalogosComponent },
      {path: 'bancos', component: NopagefoundComponent },
      {path: 'cuentas', component: NopagefoundComponent },
      {path: 'formaspago', component: NopagefoundComponent },

      {path: 'cursos', component: CursosComponent },
      {path: 'curso', component: CursoComponent },
      {path: 'curso/:id', component: CursoComponent },
      {path: 'cargos', component: CargosComponent },
      {path: 'caja', component: CajaComponent },
      {path: 'ciclos', component: CiclosEscolaresComponent },
      {path: 'inscripciones', component: InscripcionesComponent },
      {path: 'ventas', component: VentasComponent },
      {path: 'usuarios', component: UsuariosComponent, canActivate: [ AdminGuard ]},
      {path: 'usuario', component: UsuarioComponent, canActivate: [ AdminGuard ]},
      {path: 'usuario/:id', component: UsuarioComponent, canActivate: [ AdminGuard ]},
      {path: 'clientes', component: ClientesComponent},
      {path: 'cliente', component: ClienteComponent},
      {path: 'cliente/:id', component: ClienteComponent},
      {path: 'alumnos', component: AlumnosComponent},
      {path: 'alumno', component: AlumnoComponent},
      {path: 'alumno/:id', component: AlumnoComponent},
      {path: 'productos', component: ProductosComponent},
      {path: 'producto', component: ProductoComponent},
      {path: 'producto/:id', component: ProductoComponent},    
      
      {path: 'reportes/inscripciones', component: IncripcionesReportComponent},
      {path: 'reportes/pagos', component: PagosReportComponent},
      {path: 'reportes/cargos', component: CargosReportComponent },
      {path: 'estadocuenta', component: EstadoCuentaComponent},
      {path: 'estadocuenta/list', component: EstadoCuentaListComponent},
      {path: 'estadocuenta/mail', component: EstadoCuentaMailComponent},
      {path: 'estadocuenta/mail/:id', component: EstadoCuentaMailComponent},
      
      {path: 'notfound', component: NopagefoundComponent},
      {path: '', component: HomeComponent, pathMatch: 'full'},

    ]
  },


  {path: '*', component:NopagefoundComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
