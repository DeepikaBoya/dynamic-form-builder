import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FormBuilderComponent } from './form-builder.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DragDropModule,
    FormBuilderComponent
  ],
  exports: [FormBuilderComponent]
})
export class FormBuilderModule { }