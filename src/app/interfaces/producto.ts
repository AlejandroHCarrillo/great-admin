export class Producto {
    constructor( 
        public activo: boolean = true, 
        public nombre: string = "", 
        public code: string = "", 
        public descripcion: string = "", 
        public img: string = "", 
        public costo: number = 0, 
        public precio: number = 0, 
        public cantidad: number = 0, 
        public tasaIVA: number = .16, 
        public exentoIVA: boolean = false, 
        public conceptocontable: string = "", 
        public clasificacion: string = "P",
        public id?: string,
        public unidadmedida?: string
        ){
}

}