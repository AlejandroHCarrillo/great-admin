import * as moment from "moment";

export const isInvalidControl = function (name: any, form:any){
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