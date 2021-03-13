import { Injectable } from '@angular/core';
import { FileItem } from '../../shared/models/file-item';
import { fileUpload } from '../../helpers/uploadimages';

@Injectable({
  providedIn: 'root'
})
export class UploadFilesService {
  private IMAGES_FOLDER = "images";

  constructor() { }

  uploadImages(files: FileItem[], productId: string = ""): string[]{
    let imageUrls: string[] = [];

    console.log(files);

    files.forEach( async(file)=>{
      console.log(file);
      
      await fileUpload(file.archivo).then((fileUrl)  => {
        console.log(fileUrl);  
        // this.producto.img = fileUrl;
        // this.form.value.img = fileUrl;
      });
    })
    

    return imageUrls;
  }

}