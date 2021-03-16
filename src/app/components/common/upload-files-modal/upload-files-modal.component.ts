import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'upload-files-modal',
  templateUrl: './upload-files-modal.component.html',
  styleUrls: ['./upload-files-modal.component.css']
})
export class UploadFilesModalComponent implements OnInit {
  @Input() buttonText : string = "Load";
  @Input() modalTitle : string = "Upload image(s)";
  @Input() itemId : string = "XXXXXXXX-XXX";
  @Input() closeButtonText : string = "Close";

  @Output() onCompleted = new EventEmitter<string[]>();

  modalUrls: string[] = [];

  constructor() { }

  ngOnInit(): void { 
    // this.disparaEvento();
  }

  uploadCompleted(){
    console.log("uploadCompleted outImageUrls: ", this.modalUrls[0]);
    this.onCompleted.emit(this.modalUrls);
  }

  getUrls(event: any){
    // console.log("Paso 2 : Obteniendo urls del componente upload-files");
    console.log("Recibi las urls del upload: ", event);

    // this.handleChildEvent(event);

    // console.log("Estas son las modalUrls: ", this.modalUrls);
    // this.disparaEvento();
  }

  handleChildEvent(getUrls:any){
    this.modalUrls = getUrls();
  }

  uploadFinished($event:any){
    console.log("uploadFinished La carga de imagenes ha terminado.", $event);
    this.modalUrls = $event
    console.log("urls recibidas", this.modalUrls);
  }

}
