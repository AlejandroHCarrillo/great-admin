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

const routes: Routes = [
  // Rutas protegidas
  { path: '', 
    component: PagesComponent, 
    children: [
      {path: 'home', component: HomeComponent},
      {path: 'catalogos', component: CatalogosComponent },
      {path: 'usuarios', component: UsuariosComponent},
      {path: 'usuario', component: UsuarioComponent},
      {path: 'usuario/:id', component: UsuarioComponent},
      {path: 'clientes', component: ClientesComponent},
      {path: 'cliente', component: ClienteComponent},
      {path: 'cliente/:id', component: ClienteComponent},
      {path: 'productos', component: ProductosComponent},
      {path: 'producto', component: ProductoComponent},
      {path: 'producto/:id', component: ProductoComponent},    

      {path: '', component: HomeComponent, pathMatch: 'full'},

    ]
  },

  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},

  {path: '*', component:NopagefoundComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
