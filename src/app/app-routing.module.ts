import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClienteComponent } from './components/clientes/cliente/cliente.component';
import { ClientesComponent } from './components/clientes/clientes.component';
import { LoginComponent } from './components/common/auth/login.component';
import { RegisterComponent } from './components/common/auth/register.component';
import { HomeComponent } from './components/home/home.component';
import { UsuarioComponent } from './components/usuarios/usuario/usuario.component';
import { UsuariosComponent } from './components/usuarios/usuarios.component';

const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'usuarios', component: UsuariosComponent},
  {path: 'usuario', component: UsuarioComponent},
  {path: 'clientes', component: ClientesComponent},
  {path: 'cliente', component: ClienteComponent},
  {path: 'cliente/:id', component: ClienteComponent},
  {path: 'home', component: HomeComponent},
  {path: '', component: HomeComponent},
  {path: '*', pathMatch: 'full', redirectTo: 'usuarios'},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
