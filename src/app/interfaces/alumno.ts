export class Alumno {
    constructor( 
        public id: string,
        public activo: boolean = true, 
        public nombre: string = "", 
        public apaterno: string = "", 
        public amaterno: string = "", 
        public fechaNacimiento: boolean = true, 
        public fechaIngreso: boolean = true, 
        public matricula: string = "", 
        public curp: string = "", 
        public sexo: string = "", 
        public callenumero: string = "", 
        public colonia: string = "", 
        public municipio: string = "", 
        public estado: string = "", 
        public codigopostal: string = "", 
        public tcelular: string = "", 
        public tcasa: string = "", 
        public ttrabajo: string = "", 
        public email: string = "", 
        public notas: string = "", 
        public img: string = ""
        )
    {}

}