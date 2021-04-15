import { Producto } from "./producto";
export class CargoItem {
    constructor( 
        public id: string,
        public alumno: string,
        public concepto: string = "",
        public fechavencimiento: string = "",
        public precio: number = 0, 
        public cantidad: number = 1,
        public tasaIVA: number = 0, 
        public impuestos: number = 0, 
        public descuento: number = 0,
        public monto: number = 0,
        public estatus: string,
        public tipocargo: string = "",
        public isAddedSC: boolean = false,
        
        // public productoId: string = "", 
        // public producto?: { id:string, code: string, nombre: string, precio: number, tasaIVA: number },
        // public productoNombre?: string,
        // public productoCode?: string,
        )
    {}

}