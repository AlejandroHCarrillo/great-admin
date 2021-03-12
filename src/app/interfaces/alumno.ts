export class Alumno {
    constructor( 
        public activo: boolean = true, 
        public nombre: string = "", 
        public apaterno: boolean = true, 
        public amaterno: boolean = true, 
        public fechaNacimiento: boolean = true, 
        public fechaIngreso: boolean = true, 
        public curp: boolean = true, 
        public sexo: boolean = true, 
        public callenumero: boolean = true, 
        public colonia: boolean = true, 
        public municipio: boolean = true, 
        public estado: boolean = true, 
        public codigopostal: boolean = true, 
        public tcelular: boolean = true, 
        public tcasa: boolean = true, 
        public ttrabajo: boolean = true, 
        public email: boolean = true, 
        public notas: boolean = true, 
        public urlFoto: boolean = true
        ){
}

}