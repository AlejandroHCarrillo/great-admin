export class Producto {
    constructor( 
        public activo: boolean = true, 
        public nombre: string = "", 
        public code: string = "", 
        public descripcion: string = "", 
        public img: string = "", 
        public precio: number = 0, 
        public tasaIVA: number = 0, 
        public exentoIVA: boolean = false, 
        public conceptocontable: string = "", 
        public clasificacion: string = "P"
        ){
}

}