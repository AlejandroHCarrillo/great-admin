import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'modal-image',
  templateUrl: './modal-image.component.html',
  styleUrls: ['./modal-image.component.css']
})
export class ModalImageComponent implements OnInit {
  @Input() showModal:boolean = true;
  @Input() urlImage : string = "";
  @Input() description: string = "";

  constructor() { }

  ngOnInit(): void {
  }

  closeModal(){
    this.showModal = false;
  }
}
