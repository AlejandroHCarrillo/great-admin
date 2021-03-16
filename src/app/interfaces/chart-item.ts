export class ChartItem {
    constructor( 
        public id: string,
        public productoId: string = "", 
        public precio: number = 0, 
        public cantidad: number = 1,
        public tasaIVA: number = 0, 
        public impuestos: number = 0, 
        public descuento: number = 0,
        public subtotal: number = 0
        )
    {}

}