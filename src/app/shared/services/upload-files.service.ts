import { Injectable } from '@angular/core';
import { FileItem } from '../../shared/models/file-item';
import { fileUpload } from '../../helpers/uploadimages';

@Injectable({
  providedIn: 'root'
})
export class UploadFilesService {
  private IMAGES_FOLDER = "images";

  constructor() { }

  uploadFiles(files: FileItem[]) {
    let imageUrls: string[] = [];

    const promise =  new Promise( (resolve, reject) => {
      files.forEach(async(file)=>{
        // console.log(file);
        await fileUpload(file.archivo).then((fileUrl)  => {
          // console.log("Recibo esta url: ", fileUrl);  
          imageUrls.push(fileUrl)
          // this.producto.img = fileUrl;
          // this.form.value.img = fileUrl;
        });

      })
      resolve(imageUrls);
    });
    return promise;
  }

  // uploadImages(files: FileItem[]): string[] {
  //   let imageUrls: string[] = [];

  //   // console.log(files);

  //   files.forEach(async(file)=>{
  //     // console.log(file);
  //     await fileUpload(file.archivo).then((fileUrl)  => {
  //       // console.log("Recibo esta url: ", fileUrl);  
  //       imageUrls.push(fileUrl)
  //       // this.producto.img = fileUrl;
  //       // this.form.value.img = fileUrl;
  //     });


  //   })
  //   return imageUrls;
  // }

}