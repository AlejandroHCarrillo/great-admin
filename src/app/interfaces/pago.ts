export class Pago {
    constructor(
    public fechapago: Date = new Date(),
    public alumno: string = "",
    public formapago: string = "",
    public montopagado: number = 0,
    public id: string = "",
    ){}
}