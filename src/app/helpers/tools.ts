export const isInvalidControl = function (name: any, form:any){
    const control = form.get(name);
    return (!control?.valid && control?.touched);
}