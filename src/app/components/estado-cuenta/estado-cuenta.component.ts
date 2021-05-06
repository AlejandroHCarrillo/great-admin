import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';

import { CargosService } from 'src/app/services/cargos.service';
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import * as moment from 'moment';

import { AlumnosListComponent } from '../alumnos/alumnos-list/alumnos-list.component';
import { Alumno } from 'src/app/interfaces/alumno';
import { DialogService } from 'primeng/dynamicdialog';
import { PagosService } from 'src/app/services/pagos.service';
import { EstadocuentaItem } from 'src/app/interfaces/estadocuenta-item.model';
import { tiposmovimiento, ddFormasPago, ddTiposCargos, eSeverityMessages } from 'src/app/config/enums'
import { arrRemoveAt, dateEsp2Eng, getDropDownOption, isDate } from 'src/app/helpers/tools';
import { DropDownItem } from 'src/app/interfaces/drop-down-item';
import { Pago } from 'src/app/interfaces/pago';
import { Producto } from 'src/app/interfaces/producto';
import { ProductosListComponent } from '../productos/productos-list/productos-list.component';

@Component({
  selector: 'app-estado-cuenta',
  templateUrl: './estado-cuenta.component.html',
  styleUrls: ['./estado-cuenta.component.css']
})

export class EstadoCuentaComponent implements OnInit {
  fileName = "estadodecuenta";

  alumnoSelected: any;
  searchtext: string = "";
  searchResultMsg = "";

  cargos: any[] = [];
  cargoSelected: any;

  estadocuentareport: EstadocuentaItem[] = [];

  pagos: any[] = [];

  cols: any[] = [];
  exportColumns: any[] = [];

  saldo : number = 0;

  imprimirview = false;

  cmItems: MenuItem[] = [];

  pagoDialog:Boolean = false;
  formasPago: DropDownItem[] = ddFormasPago;
  formapagoSelected: DropDownItem = new DropDownItem();
  pago: Pago = new Pago();


  cargo: any = {}; //Cargo = new Cargo();
  tiposCargos: DropDownItem[] = [ { name:"Seleccione tipo de cargo", code: "" }, ...ddTiposCargos];
  tipocargoSelected: DropDownItem = new DropDownItem();
  productoSelected: any = {};

  cargoDialog:Boolean = false;

  selectedIndex: number = -1;

  constructor( 
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private dialogService: DialogService,
    private cargosService: CargosService,
    private pagosService: PagosService
    ) { }

  ngOnInit(): void {
    this.cols = [
      { field: 'id', header: 'id' },
      { field: 'fecha', header: 'Fecha' },
      { field: 'concepto', header: 'Concepto' },
      { field: 'cargo', header: 'Cargo' },
      { field: 'abono', header: 'Abono' },
      { field: 'saldo', header: 'Saldo' },
      ];

      this.exportColumns = this.cols.map(col => ({title: col.header, dataKey: col.field}));

      this.fakeInitdata();
      this.contextMenuOptions();
  }

  contextMenuOptions(){
    this.cmItems = [
          { label: 'Editar', 
            icon: 'pi pi-fw pi-pencil', 
            command: () =>  this.edit(this.cargoSelected)
          },
          { label: 'Delete', 
            icon: 'pi pi-fw pi-times', 
            command: () => this.delete(this.cargoSelected)
          },
          { label: 'Pagar', 
            icon: 'pi pi-fw pi-money-bill', 
            command: () => { 
              if(this.cargoSelected.tipo === tiposmovimiento.cargo){
                  console.log(this.cargoSelected);
    
                  this.pago.fechapago = this.cargoSelected.fecha;
                  // this.pago.formapago = row.formapago;
                  this.pago.montopagado = this.cargoSelected.cargo;                        
                  console.log(this.pago);
                  this.showPago();
                }
                else{
                  // console.log("No se puede pagar un pago.");
                  this.showToastMessage("Pagar", "Solo se pueden hacer pagos a los cargos", eSeverityMessages.error);                  
                }
            }
        },
    ];
  }

  edit( row: any ){
    console.log(row);
    this.setData(row, 0);

    if(row.tipo === tiposmovimiento.cargo){
      this.showCargo();
    } else {
      this.showPago();
    }

  }

  delete( row: any ){
    console.log("Delete: ", row);
    this.confirmationService.confirm({
      message: `¿En verdad deseas remover el ${row.tipo} de "${row.concepto}"?`,
      accept: () => {
        const itemPosition = this.estadocuentareport.findIndex((x)=>( x.id === row.id ));
        console.log("itemPosition: ", itemPosition);
        
        if( row.tipo === tiposmovimiento.cargo ){
          this.cargosService.delete(row.id)
              .then( async (resp)=>{
                const body = await resp.json()
                console.log(body);
                if(body.ok){
                  this.showToastMessage("Eliminar cargo", `Se elimino el ${ row.tipo } con exito`, eSeverityMessages.success);
                } else{
                  this.showToastMessage("Error", `Hubo un error al eliminar el ${ row.tipo } con exito`, eSeverityMessages.error);
                }

              })
        }
        if( row.tipo === tiposmovimiento.abono ){
          this.pagosService.delete(row.id)
          .then( async (resp)=>{
            const body = await resp.json()
            console.log(body);
            if(body.ok){
              this.showToastMessage(`Eliminar ${ row.tipo }`, `Se elimino el ${ row.tipo } con exito`, eSeverityMessages.success);
            } else{
              this.showToastMessage("Error", `Hubo un error al eliminar el ${ row.tipo } con exito`, eSeverityMessages.error);
            }

          })
        }
        
        this.estadocuentareport = arrRemoveAt(this.estadocuentareport, itemPosition);
 
        }
    });
  }

  async fakeInitdata(){
    this.alumnoSelected = {
      activo: true,
      amaterno: "Carrillo",
      apaterno: "Hernandez",
      email: "el_grande_ahc@hotmail.com",
      grado: "1",
      grupo: "B",
      id: "604b0343f4bc8f64f4d4b1cb",
      img: "https://res.cloudinary.com/alexthegreat/image/upload/v1615835825/ssp6eiusq1csw0t4krtn.jpg",
      matricula: "HECA19770404-1",
      nivel: "LICENCIATURA",
      nombre: "Alejandro",
    }

    this.estadocuentareport = [];

    this.cargos = await this.cargosService.findCargosByAlumno( this.alumnoSelected.id );
    this.mapCargosToReport(this.cargos);

    this.pagos = await this.pagosService.findPagosPorAlumno( this.alumnoSelected.id );
    this.mapPagosToReport(this.pagos);

    this.estadocuentareport.sort(this.comparefechas)
    this.calcularSaldos();
  }

  mapCargosToReport(data: any[]){
    this.estadocuentareport = [
      ...this.estadocuentareport, 
      ...data.map((cargo) => 
    ( 
      new EstadocuentaItem(
        cargo.id, 
        tiposmovimiento.cargo, 
        moment( new Date(cargo.fechavencimiento).getTime() ).format("DD/MM/YYYY"), 
        cargo.concepto, cargo.tipocargo, cargo.monto, 0, 0, 
        cargo.estatus)
    )
    )];

  }

  mapPagosToReport(data: any[]){
    this.estadocuentareport = [
      ...this.estadocuentareport, 
      ...data.map((abono) => 
    ( 
      new EstadocuentaItem(
        abono.id, 
        tiposmovimiento.abono, 
        moment( new Date(abono.fechapago).getTime() ).format("DD/MM/yyyy"), 
        `Pago (${String( getDropDownOption(abono.formapago, ddFormasPago ).name ).toLocaleLowerCase()})`, 
        abono.formapago , 0, abono.montopagado, 0,  
        abono.estatus)
    )
    )];

  }

  showToastMessage(title: string = "", text: string = "", tipo: string = "success"){
    this.messageService.add( {
            key: 'tmKey', 
            severity: tipo || 'success', 
            summary: title || 'Titulo', 
            detail: `${text}` || 'Texto'});
  }

  exportPdf() {
    let title = "Reporte de Cargos";
    let footer = `Reporte generado el ${ moment(new Date() ).toString() }`;

    // const doc = new jsPDF();
    // const doc = new jsPDF("p", "px", "letter", true);
    const doc = new jsPDF();
    doc.setCreationDate(new Date())
    
    const headers = [...this.cols.map( (x)=>( x.header ) )];

    const pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
    const pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();

    let textWide = doc.getStringUnitWidth(title);
    let fontwide = doc.getFontSize();
    let offsetX = (textWide * fontwide)/2;

    var data = [ [] ];    
    // data = this.estadocuentareport.map((x => ( Object.values(x) ) ));

    console.log("OJO: no esta mapeando aqui");
    
    // data = [ [this.estadocuentareport ] ];


    console.log(headers);
    console.log(this.estadocuentareport);

    doc.setFont( "times", "italic", 500);
    doc.setTextColor("navy");
    doc.setFontSize(14);

    doc.text(title, (pageWidth / 2) - title.length , 10 );

    doc.setFont("Helvetica", "italic", 200);
    doc.setTextColor("gray");
    doc.setFontSize(8);

    textWide = doc.getStringUnitWidth(footer);
    fontwide = doc.getFontSize();
    offsetX = (textWide * fontwide)/2;

    doc.text(footer, pageWidth - offsetX, pageHeight - 10);

    autoTable(doc, {
                      // styles: { fillColor: [188, 188, 188], textColor: [0,0,0] },
                      styles: { halign: 'center' },
                      columnStyles: { 0: { halign: 'left' },
                                      2: { halign: 'left', cellWidth: 500 },
                                      3: { halign: 'right' },
                                      4: { halign: 'right' },
                                      5: { halign: 'right' }
                                      }, 
                      margin: { top: 20 },
                      head: [headers],
                      body: data,
                      foot: [["", "", "", "", ""]],
                    });

    doc.save(`${this.fileName}.pdf`);

  }

  exportExcel() {
      import("xlsx").then(xlsx => {
          const worksheet = xlsx.utils.json_to_sheet(this.estadocuentareport );
          const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
          const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
          this.saveAsExcelFile(excelBuffer, this.fileName);
      });
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
      import("file-saver").then(FileSaver => {
          let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
          let EXCEL_EXTENSION = '.xlsx';
          const data: Blob = new Blob([buffer], {
              type: EXCEL_TYPE
          });
          FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
      });
  }

  showAlumnosList() {
    const ref = this.dialogService.open(AlumnosListComponent, {
      header: 'Seleccione un alumno',
      width: '70%',
      data: {
        searchtext: this.searchtext
      }
    });

    ref.onClose.subscribe(async(alumno: Alumno) => {
        // console.log("Alumno seleccionado: ", alumno);
        if (!alumno) {
          this.cargos = [];
          this.pagos = [];
          return;
        };
        
        this.alumnoSelected = { ...alumno };
        this.messageService.add({severity:'info', summary: 'Alumno seleccionado', detail:'matricula:' + alumno.matricula });
        
        this.estadocuentareport = [];

        this.cargos = await this.cargosService.findCargosByAlumno( alumno.id );
        
        this.mapCargosToReport(this.cargos);

        this.pagos = await this.pagosService.findPagosPorAlumno( alumno.id );
        this.mapPagosToReport(this.pagos);

        this.estadocuentareport.sort(this.comparefechas)
        this.calcularSaldos();
    });
  }

  private comparefechas(a:any, b:any) {
    return moment(dateEsp2Eng(String( a.fecha ))).diff(dateEsp2Eng(String( b.fecha )), "day") < 0 ? -1 : 1;
  }

  private calcularSaldos() {
    let saldo = 0;
    for (let i = 0; i < this.estadocuentareport.length; i++) {
      // const element = this.estadocuentareport[i];
      // console.log(this.estadocuentareport[i]);
      
      saldo += this.estadocuentareport[i].cargo;
      saldo -= this.estadocuentareport[i].abono;

      this.estadocuentareport[i].saldo = saldo;

      // console.log(this.estadocuentareport[i].saldo);      
    }

    this.saldo = saldo;

  }

  imprimir(){
    this.imprimirview = !this.imprimirview;
    setTimeout(()=>{
      window.print();
      this.imprimirview = false;
    }, 30);
        
  }

  showPago(){
    this.pago.alumno = this.alumnoSelected.id;
    this.pagoDialog = true;
  }

  showCargo(){
    this.pago.alumno = this.alumnoSelected.id;
    this.cargoDialog = true;
  }

  onChangeFormapago(event: any){
    console.log(event);
    this.formapagoSelected = event.value;
    this.pago.formapago = event.value.code;
  }

  hideDialog(){
    this.pagoDialog = false;
    this.selectedIndex = -1;
    this.pago = new Pago();
  }

  pagar(){
    console.log("Efectuando el pago...", this.pago);
    if(this.pago.formapago === ""){
      this.showToastMessage("Forma de Pago", "Por favor seleccione una forma de pago", eSeverityMessages.error);
      return;
    }

    let fecha: string  = String( this.pago.fechapago );
    if( !isDate(fecha) ){
      this.showToastMessage("Fecha no valida", "Por favor seleccione una fecha valida", eSeverityMessages.error);
      return;

    }

    if(this.pago.montopagado <= 0){
      this.showToastMessage("Monto Pagado", "Por favor ingrese un monto mayor a cero.", eSeverityMessages.error);
      return;
    }

    let objPago:any = {...this.pago};

    let fechaEng = dateEsp2Eng(fecha);
    objPago.fechapago = fechaEng;

    if(objPago.id){
      this.updatePago(objPago)
    } else{
      console.log("crear nuevo pago");
      this.createPago(objPago);
    }
  }
  
  createPago(objPago: any){
    console.log("Creando pago: ", objPago);
    

    objPago.formapago = this.formapagoSelected.code;
    this.pagosService.save(objPago)
    .then(async(resp)=>{
      const body = await resp.json();
      console.log("Guardado: ", body);
      if(body.ok){

        // Agregamos abono al grid
        this.estadocuentareport.push( new EstadocuentaItem(
          body.pago.id, "abono", 
          moment( new Date(body.pago.fechapago)).format("DD/MM/YYYY") , 
          "Pago", 
          body.pago.formapago, 0, body.pago.montopagado)
        );

        // this.estadocuentareport[this.selectedIndex].fecha = String( body.pago.fechapago );
        // // this.estadocuentareport[this.selectedIndex].concepto = objPago.concepto;
        // this.estadocuentareport[this.selectedIndex].abono = objPago.montopagado;

        // Ordena por fechas los registros
        this.estadocuentareport.sort(this.comparefechas)
        // Recalcula los saldos
        this.calcularSaldos();

        this.showToastMessage("Pago", "Registrado con exito", eSeverityMessages.success);
        this.hideDialog();
      } else{
        this.showToastMessage("Pago", "Error al aplicar el pago del cargo", eSeverityMessages.error);
      }
    });
    return;
  }
  
  updatePago(objPago: any){
    this.pagosService.update(objPago)
    .then(async(resp)=>{
      const body = await resp.json();
      console.log("Guardado: ", body);
      if(body.ok){

        // Actualiza valores en el grid
        this.estadocuentareport[this.selectedIndex].fecha = String( this.pago.fechapago );
        // this.estadocuentareport[this.selectedIndex].concepto = objPago.concepto;
        this.estadocuentareport[this.selectedIndex].abono = objPago.montopagado;

        // Ordena por fechas los registros
        this.estadocuentareport.sort(this.comparefechas)
        // Recalcula los saldos
        this.calcularSaldos();

        this.showToastMessage("Pago", "Registrado con exito", eSeverityMessages.success);
        this.hideDialog();
      } else{
        this.showToastMessage("Pago", "Error al aplicar el pago del cargo", eSeverityMessages.error);
      }
    });
    return;
  }
  
  setData(row: any, index: number){
    // this.selectedIndex = index;
    // console.log(row);
  
    if(row.tipo === tiposmovimiento.cargo ){
      let cargoItem = this.cargos.find((x)=>( x.id === row.id ));
      // console.log("TODO: Set datos del cargo");
      // console.log(row);
      // console.log(cargoItem);
      this.cargo = cargoItem;

      console.log(cargoItem.tipocargo, this.tiposCargos);

      this.tipocargoSelected = getDropDownOption(cargoItem.tipocargo, this.tiposCargos, false);

      console.log("tipocargoSelected: ", this.tipocargoSelected);
      

    }

    if(row.tipo === tiposmovimiento.abono ){
      this.formapagoSelected = getDropDownOption(row.formapago, this.formasPago);
      console.log(this.formapagoSelected);

      this.pago.id = row.id;
      this.pago.fechapago = row.fecha;
      this.pago.formapago = row.formapago;
      this.pago.montopagado = row.abono;
    }

  }

  // onChangeNivel(event: any){
  //   // console.log(event);
  //   this.curso.nivel = event.value.code;
  // }

  onChangeTipocargo(event: any){
    // console.log(event);
    this.tipocargoSelected = event.value;
    // if(this.cargoSelected.nombre === ""){
    //   this.cargoSelected.nombre = event.value.name;
    // }
    // this.productoSearch = event.value.name;
  }

  showProductosList() {
    const ref = this.dialogService.open(ProductosListComponent, {
      header: 'Seleccione un producto',
      width: '70%',
      data: {
        searchtext: this.cargo.nombre || ""
      }
    });

    ref.onClose.subscribe((producto: Producto) => {
      if (!producto) return;
      this.productoSelected = producto;

      this.cargo.nombre = producto.nombre;

      this.cargo.precio = producto.precio;
      this.cargo.tasaIVA = producto.tasaIVA;

      this.cargo.monto = (producto.precio * ( 1 + producto.tasaIVA ));

      // setfocus("cargonombre");
    });
  }

  addCharge(){
    console.log("Agregarndo cargo...");
    
    // if (!this.validaCargo()) return;

    // if(!this.productoSelected) return;

    // this.cargoSelected.monto = this.cargoSelected.precio * (1 + this.cargoSelected.tasaIVA );
    // this.cargoSelected.tipocargo = this.tipocargoSelected.name;

    // // console.log("this.cargoSelected: ", this.cargoSelected);
    // // return;
    
    // if(this.curso.id){
    //   // Si el curso ya existe lo guarda de una vez      
    //   if(this.cargoSelected.id){
    //     // Si el cargo ya existia lo actualizamos 
        
    //     this.cursosService.updateCharge(this.cargoSelected)
    //         .then(async(resp)=>{              
    //           const body = await resp.json();
    //           // console.log("respuesta actualizacion: ", body);
    //           this.showToastMessage("Cargo", "Actualizado con exito", eSeverityMessages.success);
    //           this.curso.cargos[this.cargoSelectedIndex] = this.cargoSelected;
    //         });
    //   } else {
    //     // console.log("Guardar cargo");
        
    //     this.cursosService.addCharge({...this.cargoSelected, curso: this.curso.id })
    //         .then(async(resp)=>{
    //           const body = await resp.json();
    //           // console.log(body);
    //           this.showToastMessage("Cargo", "Agregado con exito", eSeverityMessages.success);
    //           this.curso.cargos[this.cargoSelectedIndex] = this.cargoSelected;
    //         });
    //   }

    // }

    // // Si es un curso nuevo sin id solo lo agrega a la lista
    // if(this.cargoSelectedIndex < 0) {
    //   this.curso.cargos?.push(this.cargoSelected);
    // }

    // this.curso.cargos[this.cargoSelectedIndex] = this.cargoSelected;
    // this.hideDialog();
  }


}
