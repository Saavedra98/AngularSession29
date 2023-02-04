import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Producto } from 'src/app/interfaces/producto';
import { DataSource } from '@angular/cdk/collections';
import { Observable, ReplaySubject } from 'rxjs';
import { ProductoService } from 'src/app/services/producto.service';
import swal from'sweetalert2';




@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{
  displayedColumns: string[] = ['codigo', 'descripcion', 'precio', 'borrar?'];
  
  productos!: Producto[];
  constructor(public dialog: MatDialog, private dataService: ProductoService) {}

  mostrarProductos(){
    this.dataService.getProducto().subscribe(res => {
      this.productos = res;
      this.dataSource = new ExampleDataSource(this.productos);

    })
  }

  dataSource = new ExampleDataSource(this.productos);

  ngOnInit(): void {
    this.mostrarProductos();
  }

  // DialogOverviewExampleDialog

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog)

    dialogRef.afterClosed().subscribe(result => {
      this.mostrarProductos()
      this.dataSource.setData(result);
    });
  }

  eliminar(producto: Producto){

    swal.fire({
      title: '¿Estás seguro?',
      text: "Se eliminara de la Base de Datos",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí'
    }).then((result) => {
      if (result.value) {
        this.dataService.deleteProducto(producto);
        swal.fire(
          'Producto Eliminado',
          'El producto ha sido eliminado de la Base de Datos.',
          'success'
        )
      }
    });

  }


}


class ExampleDataSource extends DataSource<Producto> {
  private _dataStream = new ReplaySubject<Producto[]>();

  constructor(initialData: Producto[]) {
    super();
    this.setData(initialData);
  }

  connect(): Observable<Producto[]> {
    return this._dataStream;
  }

  disconnect() { }

  setData(data: Producto[]) {
    this._dataStream.next(data);
  }
}


@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'dialog-overview-example-dialog.html',
  styleUrls: ['./home.component.css']
})
export class DialogOverviewExampleDialog implements OnInit{
  
  public formulario !: FormGroup;

  constructor( private dataService: ProductoService, private form: FormBuilder,
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>, 
  ) {}

    ngOnInit(): void {
      this.formulario = this.form.group({
        codigoControl : ['', [Validators.required, Validators.minLength(1)]],
        descripcionControl : ['', [Validators.required, Validators.minLength(3)]],
        precioControl : ['', [Validators.required]],
      })
    }

    registrar(){

      if(this.formulario.valid){
        this.dataService.addProducto(this.formulario.value)
        .then(()=>{
          swal.fire({
            icon: 'success',
            title: 'Producto registrado correctamente',
            showConfirmButton: false,
            timer: 1500
          })
          this.dialogRef.close(this.formulario.value);
        })
        .catch(error => {
          swal.fire({
            icon: 'error',
            title: 'No se ha podido registrar',
            text: 'Vuelve intentarlo',
          })
        })
      }else{
        swal.fire({
          icon: 'error',
          title: 'Datos incorrectos',
          text: 'LLene todos los campos',
        })
      }

      
    }

  onNoClick(): void {
    this.dialogRef.close();
  }
}