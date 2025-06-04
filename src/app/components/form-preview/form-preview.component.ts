import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormService } from '../../services/form.service';
import { FormTemplate, FormSubmission } from '../../models/form-field.model';

@Component({
  selector: 'app-form-preview',
  templateUrl: './form-preview.component.html',
  styleUrls: ['./form-preview.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class FormPreviewComponent implements OnInit {
  formTemplate: FormTemplate | null = null;
  formSubmissions: FormSubmission[] = [];
  
  constructor(
    private formService: FormService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.loadFormTemplate(id);
        this.loadFormSubmissions(id);
      } else {
        this.router.navigate(['/forms']);
      }
    });
  }

  loadFormTemplate(id: string): void {
    this.formService.getFormTemplate(id).subscribe(template => {
      if (template) {
        this.formTemplate = template;
      } else {
        this.router.navigate(['/forms']);
      }
    });
  }

  loadFormSubmissions(formId: string): void {
    this.formService.getFormSubmissions(formId).subscribe(submissions => {
      this.formSubmissions = submissions;
    });
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleString();
  }

  getFieldLabel(fieldId: string): string {
    if (!this.formTemplate) return fieldId;
    const field = this.formTemplate.fields.find(f => f.id === fieldId);
    return field ? field.label : fieldId;
  }

  getFieldValue(submission: FormSubmission, fieldId: string): string {
    const value = submission.data[fieldId];
    
    if (value === null || value === undefined) {
      return 'Not provided';
    }
    
    if (Array.isArray(value)) {
      return value.join(', ');
    }
    
    return value.toString();
  }
}