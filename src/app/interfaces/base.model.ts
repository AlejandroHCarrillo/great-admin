export class Base{
    userUpdate?: string;
    updateDate?: number;
  
    constructor( public userCreate: string = "himself", public creationDate: number = new Date().getTime()){
    }
  }