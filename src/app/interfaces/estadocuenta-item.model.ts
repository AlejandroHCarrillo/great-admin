import { Producto } from "./producto";
export class EstadocuentaItem {
    constructor( 
        public id: string,
        public tipo: string,
        public fecha: string = "",
        public concepto: string = "",
        public formapago: string = "",
        public cargo: number = 0, 
        public abono: number = 0, 
        public saldo: number = 0, 
        public estatus: string = ""
        )
    {}

}