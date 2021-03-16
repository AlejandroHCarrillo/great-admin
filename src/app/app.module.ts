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
import { UsuarioComponent } from './components/usuarios/usuario/usuario.component';
import { UsuariosComponent } from './components/usuarios/usuarios.component';
import { LoginComponent } from './components/common/auth/login.component';
import { RegisterComponent } from './components/common/auth/register.component';

import { SharedService } from './services/shared.service';
import { ClientesService } from './services/clientes.service';
import { ProductosComponent } from './components/productos/productos.component';
import { ProductoComponent } from './components/productos/producto/producto.component';
import { ProgressComponent } from './components/common/progress/progress.component';
import { BargraphicComponent } from './components/graphics/bargraphic/bargraphic.component';
import { NopagefoundComponent } from './components/common/nopagefound/nopagefound.component';
import { PagesComponent } from './components/pages/pages.component';
import { CatalogosComponent } from './components/catalogos/catalogos.component';
import { VentasComponent } from './components/ventas/ventas.component';
import { AlumnosComponent } from './components/alumnos/alumnos.component';
import { AlumnoComponent } from './components/alumnos/alumno/alumno.component';
import { AlumnosService } from './services/alumnos.service';
import { DireccionComponent } from './components/common/direccion/direccion.component';
import { ModalImageComponent } from './components/common/modal-image/modal-image.component';
import { UploadFilesComponent } from './components/common/upload-files/upload-files.component';
import { UploadFilesService } from './shared/services/upload-files.service';
import { UploadFilesModalComponent } from './components/common/upload-files-modal/upload-files-modal.component';
import { ImagesGalleryComponent } from './components/common/images-gallery/images-gallery.component';
import { CajaComponent } from './components/caja/caja.component';
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
    RegisterComponent,
    ProductosComponent,
    ProductoComponent,
    ProgressComponent,
    BargraphicComponent,
    NopagefoundComponent,
    PagesComponent,
    CatalogosComponent,
    VentasComponent,
    AlumnosComponent,
    AlumnoComponent,
    DireccionComponent,
    ModalImageComponent,
    UploadFilesComponent,
    UploadFilesModalComponent,
    ImagesGalleryComponent,
    CajaComponent
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
    ClientesService,
    AlumnosService,
    UploadFilesService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
