export class CicloEscolar {
    constructor( 
        public activo: boolean = true,
        public nombre: string,
        public fechaInicio: string,
        public fechaFin: string,
        public id?: string
        )
    {}

}