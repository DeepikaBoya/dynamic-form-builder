import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { FormService } from '../../services/form.service';
import { FormField, FormTemplate, FieldType } from '../../models/form-field.model';
import { CdkDragDrop, moveItemInArray, CdkDrag, CdkDropList, DragDropModule } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-form-builder',
  templateUrl: './form-builder.component.html',
  styleUrls: ['./form-builder.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DragDropModule]
})
export class FormBuilderComponent implements OnInit {
  formMetaForm: FormGroup;
  fieldForm: FormGroup;
  formFields: FormField[] = [];
  editingFieldIndex: number | null = null;
  isEditMode = false;
  formId: string | null = null;
  
  fieldTypes: { label: string, value: FieldType }[] = [
    { label: 'Text Input', value: 'text' },
    { label: 'Text Area', value: 'textarea' },
    { label: 'Dropdown', value: 'dropdown' },
    { label: 'Checkbox Group', value: 'checkbox' },
    { label: 'Date Picker', value: 'date' },
    { label: 'Radio Button Group', value: 'radio' }
  ];

  constructor(
    private fb: FormBuilder,
    private formService: FormService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.formMetaForm = this.fb.group({
      name: ['', [Validators.required]],
      description: ['']
    });

    this.fieldForm = this.createFieldForm();
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.formId = id;
        this.isEditMode = true;
        this.loadFormTemplate(id);
      }
    });
  }

  loadFormTemplate(id: string): void {
    this.formService.getFormTemplate(id).subscribe(template => {
      if (template) {
        this.formMetaForm.patchValue({
          name: template.name,
          description: template.description
        });
        this.formFields = [...template.fields];
      } else {
        this.router.navigate(['/forms']);
      }
    });
  }

  createFieldForm(field?: FormField): FormGroup {
    return this.fb.group({
      type: [field?.type || 'text', [Validators.required]],
      label: [field?.label || '', [Validators.required]],
      placeholder: [field?.placeholder || ''],
      helpText: [field?.helpText || ''],
      required: [field?.required || false],
      options: [field?.options || []]
    });
  }

  onFieldTypeChange(): void {
    const fieldType = this.fieldForm.get('type')?.value;
    if (fieldType === 'dropdown' || fieldType === 'checkbox' || fieldType === 'radio') {
      if (!this.fieldForm.get('options')?.value?.length) {
        this.fieldForm.patchValue({
          options: [{ label: 'Option 1', value: 'option1' }]
        });
      }
    }
  }

  addOption(): void {
    const options = this.fieldForm.get('options')?.value || [];
    const newOption = { 
      label: `Option ${options.length + 1}`, 
      value: `option${options.length + 1}` 
    };
    this.fieldForm.patchValue({ options: [...options, newOption] });
  }

  removeOption(index: number): void {
    const options = [...this.fieldForm.get('options')?.value];
    options.splice(index, 1);
    this.fieldForm.patchValue({ options });
  }

  addField(): void {
    if (this.fieldForm.valid) {
      const fieldData = this.fieldForm.value;
      const validations = [];
      
      if (fieldData.required) {
        validations.push({
          type: 'required',
          message: `${fieldData.label} is required`
        });
      }
      
      const newField: FormField = {
        id: Math.random().toString(36).substring(2, 9),
        ...fieldData,
        validations
      };
      
      if (this.editingFieldIndex !== null) {
        this.formFields[this.editingFieldIndex] = newField;
        this.editingFieldIndex = null;
      } else {
        this.formFields.push(newField);
      }
      
      this.fieldForm = this.createFieldForm();
    }
  }

  editField(index: number): void {
    this.editingFieldIndex = index;
    const field = this.formFields[index];
    this.fieldForm = this.createFieldForm(field);
  }

  removeField(index: number): void {
    this.formFields.splice(index, 1);
    if (this.editingFieldIndex === index) {
      this.editingFieldIndex = null;
      this.fieldForm = this.createFieldForm();
    }
  }

  cancelEdit(): void {
    this.editingFieldIndex = null;
    this.fieldForm = this.createFieldForm();
  }

  onDrop(event: CdkDragDrop<FormField[]>): void {
    moveItemInArray(this.formFields, event.previousIndex, event.currentIndex);
  }

  saveForm(): void {
    if (this.formMetaForm.valid && this.formFields.length > 0) {
      const formData = {
        ...this.formMetaForm.value,
        fields: this.formFields
      };
      
      if (this.isEditMode && this.formId) {
        this.formService.updateFormTemplate(this.formId, formData).subscribe(() => {
          this.router.navigate(['/forms']);
        });
      } else {
        this.formService.createFormTemplate(formData).subscribe(() => {
          this.router.navigate(['/forms']);
        });
      }
    }
  }

  previewForm(): void {
    if (this.isEditMode && this.formId) {
      this.router.navigate(['/forms', this.formId, 'preview']);
    } else if (this.formFields.length > 0) {
      // Save form first then navigate to preview
      const formData = {
        ...this.formMetaForm.value,
        fields: this.formFields
      };
      
      this.formService.createFormTemplate(formData).subscribe(template => {
        this.router.navigate(['/forms', template.id, 'preview']);
      });
    }
  }
}