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
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogService, DynamicDialogModule } from 'primeng/dynamicdialog';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';

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
import { NopagefoundComponent } from './components/common/nopagefound/nopagefound.component';
import { PagesComponent } from './components/pages/pages.component';
import { CatalogosComponent } from './components/catalogos/catalogos.component';
import { VentasComponent } from './components/ventas/ventas.component';
import { AlumnosComponent } from './components/alumnos/alumnos.component';
import { AlumnoComponent } from './components/alumnos/alumno/alumno.component';
import { AlumnosService } from './services/alumnos.service';
import { ModalImageComponent } from './components/common/modal-image/modal-image.component';
import { UploadFilesComponent } from './components/common/upload-files/upload-files.component';
import { UploadFilesService } from './shared/services/upload-files.service';
import { UploadFilesModalComponent } from './components/common/upload-files-modal/upload-files-modal.component';
import { ImagesGalleryComponent } from './components/common/images-gallery/images-gallery.component';
import { CajaComponent } from './components/caja/caja.component';
import { ButtonModule } from 'primeng/button';
import { ProductosListComponent } from './components/productos/productos-list/productos-list.component';
import { AlumnosListComponent } from './components/alumnos/alumnos-list/alumnos-list.component';
import { AuthService, SubirArchivoService } from './services/services.index';
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
    NopagefoundComponent,
    PagesComponent,
    CatalogosComponent,
    VentasComponent,
    AlumnosComponent,
    AlumnoComponent,
    AlumnosListComponent,
    ModalImageComponent,
    UploadFilesComponent,
    UploadFilesModalComponent,
    ImagesGalleryComponent,
    CajaComponent,
    ProductosListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,

    MessagesModule,
    MessageModule,
    BrowserAnimationsModule,
    TableModule, 
    CalendarModule,
    RadioButtonModule,
    DropdownModule,
    AutoCompleteModule,
    InputMaskModule,
    CheckboxModule,
    PaginatorModule,
    InputSwitchModule,
    InputNumberModule,
    DynamicDialogModule,
    ToastModule,
    ButtonModule,
    ConfirmDialogModule
  ],
  providers: [
    MessageService,
    ConfirmationService,
    DialogService,
    AuthService,
    SharedService,
    ClientesService,
    AlumnosService,
    UploadFilesService,
    SubirArchivoService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
