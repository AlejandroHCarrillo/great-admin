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