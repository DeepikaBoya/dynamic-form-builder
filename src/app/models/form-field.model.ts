export type FieldType = 'text' | 'textarea' | 'dropdown' | 'checkbox' | 'date' | 'radio';

export interface ValidationRule {
  type: 'required' | 'minLength' | 'maxLength' | 'pattern' | 'email';
  value?: any;
  message: string;
}

export interface FieldOption {
  label: string;
  value: string;
}

export interface FormField {
  id: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  helpText?: string;
  required: boolean;
  options?: FieldOption[];
  validations: ValidationRule[];
}

export interface FormTemplate {
  id: string;
  name: string;
  description?: string;
  fields: FormField[];
  createdAt: Date;
  updatedAt: Date;
}

export interface FormSubmission {
  id: string;
  formId: string;
  data: { [key: string]: any };
  submittedAt: Date;
}