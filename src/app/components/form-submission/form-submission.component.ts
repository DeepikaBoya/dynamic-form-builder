import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormService } from '../../services/form.service';
import { FormTemplate, FormField } from '../../models/form-field.model';

@Component({
  selector: 'app-form-submission',
  templateUrl: './form-submission.component.html',
  styleUrls: ['./form-submission.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class FormSubmissionComponent implements OnInit {
  formTemplate: FormTemplate | null = null;
  submissionForm: FormGroup;
  isPreviewMode = false;
  isSubmitting = false;
  submitSuccess = false;
  submitError = false;

  constructor(
    private fb: FormBuilder,
    private formService: FormService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.submissionForm = this.fb.group({});
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.loadFormTemplate(id);
      } else {
        this.router.navigate(['/forms']);
      }
    });

    this.route.url.subscribe(url => {
      this.isPreviewMode = url.some(segment => segment.path === 'preview');
    });
  }

  loadFormTemplate(id: string): void {
    this.formService.getFormTemplate(id).subscribe(template => {
      if (template) {
        this.formTemplate = template;
        this.buildForm(template.fields);
      } else {
        this.router.navigate(['/forms']);
      }
    });
  }

  buildForm(fields: FormField[]): void {
    const formGroup: { [key: string]: any } = {};

    fields.forEach(field => {
      const validators = [];
      
      if (field.required) {
        validators.push(Validators.required);
      }
      
      field.validations.forEach(validation => {
        switch (validation.type) {
          case 'minLength':
            validators.push(Validators.minLength(validation.value));
            break;
          case 'maxLength':
            validators.push(Validators.maxLength(validation.value));
            break;
          case 'pattern':
            validators.push(Validators.pattern(validation.value));
            break;
          case 'email':
            validators.push(Validators.email);
            break;
        }
      });
      
      formGroup[field.id] = [null, validators];
    });
    
    this.submissionForm = this.fb.group(formGroup);
  }

  getFieldErrorMessage(field: FormField): string {
    const control = this.submissionForm.get(field.id);
    
    if (!control || !control.errors || !control.touched) {
      return '';
    }
    
    if (control.errors['required']) {
      return `${field.label} is required`;
    }
    
    if (control.errors['minlength']) {
      return `${field.label} must be at least ${control.errors['minlength'].requiredLength} characters`;
    }
    
    if (control.errors['maxlength']) {
      return `${field.label} cannot exceed ${control.errors['maxlength'].requiredLength} characters`;
    }
    
    if (control.errors['pattern']) {
      return `${field.label} has an invalid format`;
    }
    
    if (control.errors['email']) {
      return `${field.label} must be a valid email address`;
    }
    
    return 'Invalid value';
  }

  onSubmit(): void {
    if (this.submissionForm.valid && this.formTemplate) {
      this.isSubmitting = true;
      
      if (this.isPreviewMode) {
        // In preview mode, just show success message
        this.submitSuccess = true;
        this.isSubmitting = false;
        return;
      }
      
      this.formService.submitForm(this.formTemplate.id, this.submissionForm.value)
        .subscribe({
          next: () => {
            this.submitSuccess = true;
            this.isSubmitting = false;
          },
          error: () => {
            this.submitError = true;
            this.isSubmitting = false;
          }
        });
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.submissionForm.controls).forEach(key => {
        this.submissionForm.get(key)?.markAsTouched();
      });
    }
  }

  resetForm(): void {
    this.submissionForm.reset();
    this.submitSuccess = false;
    this.submitError = false;
  }

  goBack(): void {
    this.router.navigate(['/forms']);
  }
}