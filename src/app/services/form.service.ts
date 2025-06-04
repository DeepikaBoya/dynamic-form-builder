import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { FormTemplate, FormSubmission } from '../models/form-field.model';

@Injectable({
  providedIn: 'root'
})
export class FormService {
  private formTemplates: FormTemplate[] = [];
  private formSubmissions: FormSubmission[] = [];
  
  private formTemplatesSubject = new BehaviorSubject<FormTemplate[]>([]);
  public formTemplates$ = this.formTemplatesSubject.asObservable();
  
  private formSubmissionsSubject = new BehaviorSubject<FormSubmission[]>([]);
  public formSubmissions$ = this.formSubmissionsSubject.asObservable();

  constructor() {
    this.loadFromStorage();
    
    
  }
  
 

  private loadFromStorage(): void {
    const storedTemplates = localStorage.getItem('formTemplates');
    if (storedTemplates) {
      this.formTemplates = JSON.parse(storedTemplates);
      this.formTemplatesSubject.next([...this.formTemplates]);
    }

    const storedSubmissions = localStorage.getItem('formSubmissions');
    if (storedSubmissions) {
      this.formSubmissions = JSON.parse(storedSubmissions);
      this.formSubmissionsSubject.next([...this.formSubmissions]);
    }
  }

  private saveToStorage(): void {
    localStorage.setItem('formTemplates', JSON.stringify(this.formTemplates));
    localStorage.setItem('formSubmissions', JSON.stringify(this.formSubmissions));
  }

  // Form Template Methods
  getFormTemplates(): Observable<FormTemplate[]> {
    return of([...this.formTemplates]);
  }

  getFormTemplate(id: string): Observable<FormTemplate | undefined> {
    const template = this.formTemplates.find(t => t.id === id);
    return of(template);
  }

  createFormTemplate(template: Omit<FormTemplate, 'id' | 'createdAt' | 'updatedAt'>): Observable<FormTemplate> {
    const newTemplate: FormTemplate = {
      ...template,
      id: Math.random().toString(36).substring(2, 9),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.formTemplates.push(newTemplate);
    this.formTemplatesSubject.next([...this.formTemplates]);
    this.saveToStorage();
    
    return of(newTemplate);
  }

  updateFormTemplate(id: string, template: Partial<FormTemplate>): Observable<FormTemplate | undefined> {
    const index = this.formTemplates.findIndex(t => t.id === id);
    if (index !== -1) {
      this.formTemplates[index] = {
        ...this.formTemplates[index],
        ...template,
        updatedAt: new Date()
      };
      
      this.formTemplatesSubject.next([...this.formTemplates]);
      this.saveToStorage();
      
      return of(this.formTemplates[index]);
    }
    
    return of(undefined);
  }

  deleteFormTemplate(id: string): Observable<boolean> {
    const initialLength = this.formTemplates.length;
    this.formTemplates = this.formTemplates.filter(t => t.id !== id);
    
    if (initialLength !== this.formTemplates.length) {
      this.formTemplatesSubject.next([...this.formTemplates]);
      this.saveToStorage();
      return of(true);
    }
    
    return of(false);
  }

  // Form Submission Methods
  submitForm(formId: string, data: { [key: string]: any }): Observable<FormSubmission> {
    const submission: FormSubmission = {
      id: Math.random().toString(36).substring(2, 9),
      formId,
      data,
      submittedAt: new Date()
    };

    this.formSubmissions.push(submission);
    this.formSubmissionsSubject.next([...this.formSubmissions]);
    this.saveToStorage();
    
    return of(submission);
  }

  getFormSubmissions(formId?: string): Observable<FormSubmission[]> {
    if (formId) {
      return of(this.formSubmissions.filter(s => s.formId === formId));
    }
    return of([...this.formSubmissions]);
  }

  getFormSubmission(id: string): Observable<FormSubmission | undefined> {
    const submission = this.formSubmissions.find(s => s.id === id);
    return of(submission);
  }
}