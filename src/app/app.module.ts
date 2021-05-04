import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

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
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { ToolbarModule } from 'primeng/toolbar';
import { RatingModule } from 'primeng/rating';
import { DialogModule } from 'primeng/dialog';
import { TooltipModule } from 'primeng/tooltip';
import { ContextMenuModule } from 'primeng/contextmenu';

import { MessageService } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';

// Graficas
import { ChartsModule } from 'ng2-charts';
// import { ChartModule } from 'primeng/chart';

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
// import { ClientesService } from './services/clientes.service';
import { ProductosComponent } from './components/productos/productos.component';
import { ProductoComponent } from './components/productos/producto/producto.component';
import { ProgressComponent } from './components/common/progress/progress.component';
import { NopagefoundComponent } from './components/common/nopagefound/nopagefound.component';
import { PagesComponent } from './components/pages/pages.component';
import { CatalogosComponent } from './components/catalogos/catalogos.component';
import { VentasComponent } from './components/ventas/ventas.component';
import { AlumnosComponent } from './components/alumnos/alumnos.component';
import { AlumnoComponent } from './components/alumnos/alumno/alumno.component';
// import { AlumnosService } from './services/alumnos.service';
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
import { InscripcionesComponent } from './components/inscripciones/inscripciones.component';
import { CiclosEscolaresComponent } from './components/ciclos-escolares/ciclos-escolares.component';
import { CursosComponent } from './components/cursos/cursos.component';
import { CursoComponent } from './components/cursos/curso/curso.component';
import { ServicesModule } from './services/services.module';
import { IncripcionesReportComponent } from './components/inscripciones/incripciones-report/incripciones-report.component';
import { EstadoCuentaComponent } from './components/estado-cuenta/estado-cuenta.component';
import { CargosComponent } from './components/cargos/cargos.component';
import { CargosReportComponent } from './components/cargos/cargos-report/cargos-report.component';
import { PagosComponent } from './components/pagos/pagos.component';
import { PagosReportComponent } from './components/pagos/pagos-report/pagos-report.component';
import { EstadoCuentaMailComponent } from './components/estado-cuenta/estado-cuenta-mail/estado-cuenta-mail.component';
import { EstadoCuentaListComponent } from './components/estado-cuenta/estado-cuenta-list/estado-cuenta-list.component';
import { TokenInterceptorService } from './interceptors/token-interceptor.service';
import { BargraphicComponent } from './components/graphics/bargraphic/bargraphic.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    BargraphicComponent,
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
    ProductosListComponent,
    InscripcionesComponent,
    CiclosEscolaresComponent,
    CursosComponent,
    CursoComponent,
    IncripcionesReportComponent,
    EstadoCuentaComponent,
    CargosComponent,
    CargosReportComponent,
    PagosComponent,
    PagosReportComponent,
    EstadoCuentaMailComponent,
    EstadoCuentaListComponent,
    DashboardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,

    ServicesModule,

    ChartsModule,
    // ChartModule,

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
    DialogModule,
    TooltipModule,
    DynamicDialogModule,
    ToastModule,
    ButtonModule,
    ConfirmDialogModule,
    ConfirmPopupModule,
    ToolbarModule,
    RatingModule,
    ContextMenuModule
  ],
  providers: [
    MessageService,
    ConfirmationService,
    DialogService,
    AuthService,
    SharedService,
    UploadFilesService,
    SubirArchivoService,

    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
