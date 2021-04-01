import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
    LoginGuard,
    AdminGuard,
    VerificatokenGuard,

    // SettingsService,
    // SidebarService,
    // SharedService,

    AuthService,
    // HospitalService,
    // MedicoService,

    SubirArchivoService,

    ClientesService,
    AlumnosService
    
   } from './services.index';
  
  @NgModule({
    imports: [
      CommonModule,
      // HttpClientModule
    ],
    providers: [
      LoginGuard,
      AdminGuard,
      VerificatokenGuard,
      // SettingsService,
      // SidebarService,
      // SharedService,
      AuthService,
      // HospitalService,
      // MedicoService,
      SubirArchivoService,
      // ModalUploadService
      ClientesService,
      AlumnosService,
  
    ],
    declarations: []
  })
  export class ServicesModule { }