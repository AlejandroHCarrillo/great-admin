import { Producto } from "./producto";
export class CargoCurso {
    constructor( 
        public id: string,
        public nombre: string,
        public descripcion: string,
        
        public excentoIVA: boolean = true,
        public precio: number = 0, 
        public tasaIVA: number = 0, 
        public monto: number = 0,
        public numpagos: number = 1,
        public intervalopagos: number = 1,
        
        public producto?: Producto
        )
    {}

}