import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { Curso } from "src/app/interfaces/curso";
import { CargoItem } from "src/app/interfaces/cargo-item";
import { NgForm } from "@angular/forms";

import { CursosService, CargosService, UsuariosService } from "src/app/services/services.index";
import { ddNiveles } from "src/app/config/enums";
import { DropDownItem } from "src/app/interfaces/drop-down-item";

@Component({
  selector: "app-curso",
  templateUrl: "./curso.component.html",
  styleUrls: ['./curso.component.css']
})
export class CursoComponent implements OnInit {
  niveles: DropDownItem[] = ddNiveles;
  nivelSelected : DropDownItem = new DropDownItem();

  curso: Curso = new Curso("", "", "", "");
  cargos: CargoItem[] = [];
  idparam: string = "";

  constructor(
    public router: Router,
    public activatedRoute: ActivatedRoute,
    public cargosService: CargosService,
    public cursosService: CursosService,
    public usuariosService: UsuariosService,
    // public _modalUploadService: ModalUploadService
  ) {
    activatedRoute.params.subscribe(params => {
      let id = params.id;
      this.idparam = id;
      if (id !== "new") {
        this.getCurso(id);
      }
    });
  }

  ngOnInit() {
    this.cargosService
      .getCargos()
      .then((resp:any) => (this.cargos = resp.cargos));
  }

  getCurso(id: string) {
    if(!id || id==="new"){ 
      this.curso = new Curso();
      return;
    }
    this.cursosService.getCursoById(id)
      .then(async (resp) => {      
          const body = await resp.json();
          // console.log(body.curso);
          this.curso = body.curso;
          // this.curso.cargo = curso.cargo.id;
          // this.cargo = curso.cargo.id;

          this.getCargosCurso(this.curso.id);
    });
  }

  guardarCurso(f: NgForm) {
    if (f.invalid) {
      return;
    }

    // setteamos el usuario actual que hace la modificacion
    // this.curso.usuario = { name: "Usuario dummy" }; //this.usuariosService.usuario.id;

    if (this.idparam === "nuevo") {
      // console.log('Creando Curso');
      this.cursosService.save(this.curso)
      .then(async (resp) => {      
        const body = await resp.json();

        console.log(body.curso);
        this.curso = body.curso;
        this.router.navigate(["/curso", this.curso.id]);
      });
    } else {
      // console.log('Actualizando Curso');
      this.cursosService.update(this.curso).then(() => {
        this.router.navigate(["/curso", this.idparam]);
      });
    }
  }

  getCargosCurso(id: string) {
    console.log("Disabled");
    
    // this.cargosService.obtenerCargo(id).subscribe(cargo => {
    //   this.cargo = cargo;
    //   if (this.cargo) {
    //     console.log(this.cargo.img);
    //   }
    // });
  }

  cambiarFoto(id: string) {
    console.log("Disabled");

    // this._modalUploadService.mostrarModal("cursos", id);

    // this._modalUploadService.notificacion.subscribe(resp => {
    //   console.log(resp);
    //   this.curso.img = resp.curso.img;
    // });
  }

  isInvalid(controlname:string){
    // console.log("TODO isInvalid: ", controlname);
    
    return false;
  }

  save(form: any){
    console.log("TODO: Saving...", this.idparam, form);
  
    this.cursosService.save(form)
      .then(async(resp)=>{
        const body = await resp.json();

        console.log(body);
        
      });

  }

  onChangeNivel(event: any){
    console.log(event);
    this.curso.nivel = event.value.code;
  }
  
}