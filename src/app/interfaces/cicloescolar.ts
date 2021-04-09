export class CicloEscolar {
    constructor( 
        public activo: boolean = true,
        public nombre: string,
        public fechaInicio: Date,
        public fechaFin: Date,
        public id?: string
        )
    {}

}