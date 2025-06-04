import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormService } from '../../services/form.service';
import { AuthService } from '../../services/auth.service';
import { FormTemplate } from '../../models/form-field.model';

@Component({
  selector: 'app-form-list',
  templateUrl: './form-list.component.html',
  styleUrls: ['./form-list.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class FormListComponent implements OnInit {
  formTemplates: FormTemplate[] = [];
  isAdmin = false;

  constructor(
    private formService: FormService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.isAdmin = this.authService.isAdmin();
    this.loadFormTemplates();
    
    this.formService.formTemplates$.subscribe(templates => {
      this.formTemplates = templates;
    });
  }

  loadFormTemplates(): void {
    this.formService.getFormTemplates().subscribe(templates => {
      this.formTemplates = templates;
    });
  }

  deleteForm(id: string, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    
    if (confirm('Are you sure you want to delete this form?')) {
      this.formService.deleteFormTemplate(id).subscribe(() => {
        this.loadFormTemplates();
      });
    }
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString();
  }
}