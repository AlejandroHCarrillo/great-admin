import { CargoCurso } from "./cargocurso";

export class Curso {
    constructor( 
        public id: string = "", 
        public activo: boolean = true, 
        public code: string = "", 
        public nombre: string = "", 
        public descripcion: string = "", 
        public costo: number = 0, 
        public nivel: string = "PRIMARIA",
        public grado: number = 1, 
        public intervalopagos: number = 1, 
        public numpagos: number = 1, 
        public fechaprimerpago: string = "",
        public cargos: CargoCurso[] = []
        )
    {}
}