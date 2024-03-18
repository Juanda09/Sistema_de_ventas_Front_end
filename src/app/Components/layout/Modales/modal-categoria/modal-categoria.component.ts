
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Categoria } from 'src/app/interfaces/categoria';
import { CategoriaService } from'src/app/services/categoria.service';
import { UtilidadService } from 'src/app/Reutilizable/utilidad.service';

@Component({
  selector: 'app-modal-categoria',
  templateUrl: './modal-categoria.component.html',
  styleUrls: ['./modal-categoria.component.css']
})
export class ModalCategoriaComponent {
  formularioCategoria: FormGroup;
  TituloAccion: string = "Agregar";
  botonAccion: string = "Guardar";
  constructor(
    public dialogRef: MatDialogRef<ModalCategoriaComponent>,
    @Inject(MAT_DIALOG_DATA) public datosCategorias: Categoria,
    formBuilder: FormBuilder,
    private categoriaService: CategoriaService, // Declaración de categoriaService como propiedad pública
    private utilidadService: UtilidadService
  ) {
    this.formularioCategoria = formBuilder.group({
      nombre: ['', Validators.required]
    });
  }

  guardarCategoria() {
    // Obtener el valor del formulario
    const formData = this.formularioCategoria.value;

    // Crear el objeto categoría con el valor del formulario
    const nuevaCategoria: Categoria = {
      ...formData,
    };

    // Llamar al servicio para guardar la categoría
    this.categoriaService.guardarCategorias(nuevaCategoria).subscribe({
      next: (response) => {
        if (response.status) {
          // Mostrar alerta de éxito
          this.utilidadService.mostraralerta("Categoría creada exitosamente", "Éxito");
          // Cerrar el diálogo modal
          this.dialogRef.close();
        } else {
          // Mostrar alerta de error
          this.utilidadService.mostraralerta(response.msg, "Error");
        }
      },
      error: (error) => {
        console.error('Error al guardar categoría:', error);
        // Mostrar alerta de error
        this.utilidadService.mostraralerta("Error al guardar categoría", "Error");
      }
    });
  }
  cerrarDialogo(): void {
    this.dialogRef.close();
  }
}
