import { TestBed } from '@angular/core/testing';
import { FormService } from './form.service';
import { FormTemplate, FormField, FormSubmission } from '../models/form-field.model';

describe('FormService', () => {
  let service: FormService;
  let localStorageSpy: any;

  const mockFormTemplate: FormTemplate = {
    id: 'test-id',
    name: 'Test Form',
    description: 'Test Description',
    fields: [
      {
        id: 'field1',
        type: 'text',
        label: 'Test Field',
        required: true,
        validations: [
          { type: 'required', message: 'Test Field is required' }
        ]
      }
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const mockFormSubmission: FormSubmission = {
    id: 'submission-id',
    formId: 'test-id',
    data: { field1: 'Test Value' },
    submittedAt: new Date()
  };

  beforeEach(() => {
    // Create spies for localStorage
    localStorageSpy = {
      getItem: jasmine.createSpy('getItem'),
      setItem: jasmine.createSpy('setItem'),
      removeItem: jasmine.createSpy('removeItem')
    };

    spyOn(localStorage, 'getItem').and.callFake(localStorageSpy.getItem);
    spyOn(localStorage, 'setItem').and.callFake(localStorageSpy.setItem);
    spyOn(localStorage, 'removeItem').and.callFake(localStorageSpy.removeItem);

    TestBed.configureTestingModule({
      providers: [FormService]
    });
    
    service = TestBed.inject(FormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Form Templates', () => {
    it('should create a form template', (done: DoneFn) => {
      const newTemplate = {
        name: 'New Form',
        description: 'New Description',
        fields: [
          {
            id: 'field1',
            type: 'text',
            label: 'New Field',
            required: true,
            validations: []
          }
        ]
      };
      
      service.createFormTemplate(newTemplate).subscribe(result => {
        expect(result.name).toBe('New Form');
        expect(result.description).toBe('New Description');
        expect(result.fields.length).toBe(1);
        expect(result.id).toBeDefined();
        expect(result.createdAt).toBeDefined();
        expect(result.updatedAt).toBeDefined();
        
        // Check if localStorage was called
        expect(localStorage.setItem).toHaveBeenCalled();
        done();
      });
    });

    it('should get all form templates', (done: DoneFn) => {
      // Set up the service with a mock template
      service['formTemplates'] = [mockFormTemplate];
      
      service.getFormTemplates().subscribe(templates => {
        expect(templates.length).toBe(1);
        expect(templates[0].id).toBe('test-id');
        expect(templates[0].name).toBe('Test Form');
        done();
      });
    });

    it('should get a form template by id', (done: DoneFn) => {
      // Set up the service with a mock template
      service['formTemplates'] = [mockFormTemplate];
      
      service.getFormTemplate('test-id').subscribe(template => {
        expect(template).toBeDefined();
        expect(template?.id).toBe('test-id');
        expect(template?.name).toBe('Test Form');
        done();
      });
    });

    it('should update a form template', (done: DoneFn) => {
      // Set up the service with a mock template
      service['formTemplates'] = [mockFormTemplate];
      
      const updates = {
        name: 'Updated Form',
        description: 'Updated Description'
      };
      
      service.updateFormTemplate('test-id', updates).subscribe(template => {
        expect(template).toBeDefined();
        expect(template?.name).toBe('Updated Form');
        expect(template?.description).toBe('Updated Description');
        expect(localStorage.setItem).toHaveBeenCalled();
        done();
      });
    });

    it('should delete a form template', (done: DoneFn) => {
      // Set up the service with a mock template
      service['formTemplates'] = [mockFormTemplate];
      
      service.deleteFormTemplate('test-id').subscribe(result => {
        expect(result).toBe(true);
        expect(service['formTemplates'].length).toBe(0);
        expect(localStorage.setItem).toHaveBeenCalled();
        done();
      });
    });
  });

  describe('Form Submissions', () => {
    it('should submit a form', (done: DoneFn) => {
      const formData = { field1: 'Test Value' };
      
      service.submitForm('test-id', formData).subscribe(submission => {
        expect(submission.formId).toBe('test-id');
        expect(submission.data).toEqual(formData);
        expect(submission.id).toBeDefined();
        expect(submission.submittedAt).toBeDefined();
        expect(localStorage.setItem).toHaveBeenCalled();
        done();
      });
    });

    it('should get all submissions for a form', (done: DoneFn) => {
      // Set up the service with a mock submission
      service['formSubmissions'] = [mockFormSubmission];
      
      service.getFormSubmissions('test-id').subscribe(submissions => {
        expect(submissions.length).toBe(1);
        expect(submissions[0].formId).toBe('test-id');
        expect(submissions[0].data).toEqual({ field1: 'Test Value' });
        done();
      });
    });

    it('should get a specific submission by id', (done: DoneFn) => {
      // Set up the service with a mock submission
      service['formSubmissions'] = [mockFormSubmission];
      
      service.getFormSubmission('submission-id').subscribe(submission => {
        expect(submission).toBeDefined();
        expect(submission?.id).toBe('submission-id');
        expect(submission?.formId).toBe('test-id');
        done();
      });
    });
  });
});