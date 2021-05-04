import * as moment from "moment";
import { aMeses, ddFormasPago, enumRol } from 'src/app/config/enums'
import { DropDownItem } from "../interfaces/drop-down-item";

export const isInvalidControl = (name: any, form:any) => {
    const control = form.get(name);
    return (!control?.valid && control?.touched);
}

export const checkRole = (level: string = "GUEST") => {
    let usuario: any;
    if(level === "GUEST") return true;

    let user = localStorage.getItem("usuario");
    if(!user) return false;

    usuario = JSON.parse( user );
    return ( usuario.role === enumRol.ADMIN );
  }


export const setfocus = function (controlname: string="") {
    document.getElementsByName(controlname)[0].focus(); 
}

export const isDate = ( value: string ) => {
    try {

        if ( !value ){
            return false;
        }
        
        const fecha = moment( new Date(value).getTime() );
        
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

export const getMes = (strNumMes: string) => {
    return aMeses[Number(strNumMes)-1];
}

export const getFormaPago = (strcode: string) => {
    return ddFormasPago.find((x)=>(x.code === strcode ))?.name;
}

export const getDropDownOption = (codeOrName:string, arrOptions: DropDownItem[] = [], byCode: boolean = true):any => {
    if (byCode) return arrOptions.find((obj : DropDownItem ) => ( String(obj.code).toUpperCase() === String(codeOrName).toUpperCase() ));
    if (!byCode) return arrOptions.find((obj : DropDownItem ) => ( String(obj.name).toUpperCase() === String(codeOrName).toUpperCase() ));
}

export const getLastDayOfMonth = (yearmonth: string): string =>{
    if(isDate(`${yearmonth}-31`)){
      return `${yearmonth}-31`;
    } else if (isDate(`${yearmonth}-30`)){
      return `${yearmonth}-30`;
    } else if (isDate(`${yearmonth}-29`)){
      return `${yearmonth}-29`;
    }
    return `${yearmonth}-28`;
  };



