import * as moment from "moment";

export const isInvalidControl = (name: any, form:any) => {
    const control = form.get(name);
    return (!control?.valid && control?.touched);
}

export const setfocus = function (controlname: string="") {
    document.getElementsByName(controlname)[0].focus(); 
}

export const isDate = ( value: string ) => {
    try {

        if ( !value ){
            return false;
        }
        
        const fecha = moment( value );
        
        if (fecha.isValid()){
            return true;
        }
        return false;
    } catch(error){        
        return false;
    }
}

export const arraycounter = function (i: number) {
    return new Array(i);
}

export const arrRemoveAt = (arr: any[], index:number) => {
    // https://love2dev.com/blog/javascript-remove-from-array/
    if(index < 0 || index > arr.length-1 ) { return arr }

    // return [ ...arr.splice(index, 1) ];

    let arrClon = [...arr];
    return [ ...arrClon.splice(0, index), 
             ...arr.splice(index+1)
           ];

}

export const buildRFC = (nombre: string, apaterno: string, amaterno: string, fecha: Date) =>{
    let ffecha = moment(fecha).format("yyMMDD");
    // console.log(ffecha);
    return `${apaterno.substr(0,2).toUpperCase()}${amaterno.substr(0,1).toUpperCase()}${nombre.substr(0,1).toUpperCase()}${ffecha}`;
}

export const buildMatricula = (nombre: string, apaterno: string, amaterno: string, fecha: Date) =>{
    let ffecha = moment(fecha).format("yyMMDD");
    // console.log(ffecha);
    return `${apaterno.substr(0,2).toUpperCase()}${amaterno.substr(0,1).toUpperCase()}${nombre.substr(0,1).toUpperCase()}${ffecha}-1`;
}

export const dateEsp2Eng = (fecha: string) => {
    try{
        let arrFecha = fecha.replace("-", "/").split("/");
        return `${arrFecha[1]}/${arrFecha[0]}/${arrFecha[2]}`;
    } catch(error){
        console.log(error);
        return "";
    }
}

export const sumArrayNumeric = (dataArr: any) => {
    if(!dataArr || dataArr.length === 0 ) return;
    return [...dataArr].reduce((total, value) => ( total + value ) );;
}
