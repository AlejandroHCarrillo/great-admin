export class FileItem{
    public archivo: File;
    public name: string;
    public url: string;
    public estaSubiendo: boolean;
    public size: number;
    public type: string;
    public progress: number;
  
    constructor(archivo: File){
      this.archivo = archivo;
      this.name = archivo.name;
      this.size = archivo.size;
      this.type = archivo.type;
      
      this.estaSubiendo = false;
      this.progress = 0;
      
      this.url = "";
    }
  }