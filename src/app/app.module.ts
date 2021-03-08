import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';


import { CalendarModule } from 'primeng/calendar';
import { RadioButtonModule } from 'primeng/radiobutton';
import { DropdownModule } from 'primeng/dropdown';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { InputMaskModule } from 'primeng/inputmask';
import { TableModule } from 'primeng/table';
import { CheckboxModule } from 'primeng/checkbox';
import { PaginatorModule } from 'primeng/paginator';
import { InputSwitchModule } from 'primeng/inputswitch';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/common/navbar/navbar.component';
import { HomeComponent } from './components/home/home.component';
import { FooterComponent } from './components/common/footer/footer.component';
import { SidebarComponent } from './components/common/sidebar/sidebar.component';
import { ClientesComponent } from './components/clientes/clientes.component';
import { ClienteComponent } from './components/clientes/cliente/cliente.component';
import { UsuariosComponent } from './components/usuarios/usuarios.component';
import { UsuarioComponent } from './components/usuarios/usuario/usuario.component';
import { LoginComponent } from './components/common/auth/login.component';
import { RegisterComponent } from './components/common/auth/register.component';

import { SharedService } from './services/shared.service';
import { ClientesService } from './services/clientes.service';
@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    FooterComponent,
    SidebarComponent,
    ClientesComponent,
    ClienteComponent,
    UsuariosComponent,
    UsuarioComponent,
    LoginComponent,
    RegisterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,

    BrowserAnimationsModule,
    TableModule, 
    CalendarModule,
    RadioButtonModule,
    DropdownModule,
    AutoCompleteModule,
    InputMaskModule,
    CheckboxModule,
    PaginatorModule,
    InputSwitchModule

  ],
  providers: [
    SharedService,
    ClientesService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
