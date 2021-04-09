export class CartItem {
    constructor( 
        public index: number = 0,
        public id: string,
        public productoId: string = "", 
        public precio: number = 0, 
        public cantidad: number = 1,
        public tasaIVA: number = 0, 
        public impuestos: number = 0, 
        public descuento: number = 0,
        public monto: number = 0,
        public producto?: { id: string, code: string, nombre: string, precio: number, tasaIVA: number },
        public cargoindex: number = -1,
        public productoNombre?: string,
        public productoCode?: string,
        )
    {}

}