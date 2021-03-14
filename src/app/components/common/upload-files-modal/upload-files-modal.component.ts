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

  @Output() outImageUrls = new EventEmitter<string[]>();

  modalUrls: string[] = ["url limpio"];

  constructor() { }

  ngOnInit(): void { 
    // this.disparaEvento();
  }

  disparaEvento(){
    console.log("Se disparo el evento outImageUrls con el valor ", this.modalUrls[0]);    
    this.outImageUrls.emit([this.modalUrls[0]]);
  }

  getUrls(event: any){
    // console.log("Paso 2 : Obteniendo urls del componente upload-files");
    console.log("Recibi las urls del upload: ", event);

    this.handleChildEvent(event);

    // console.log("Estas son las modalUrls: ", this.modalUrls);
    // this.disparaEvento();
  }

  handleChildEvent(getUrls:any){
    this.modalUrls = getUrls();
  }

}
