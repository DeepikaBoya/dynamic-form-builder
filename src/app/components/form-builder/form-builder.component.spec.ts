import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';
import { FormBuilderComponent } from './form-builder.component';
import { FormService } from '../../services/form.service';
import { CommonModule } from '@angular/common';
import { CdkDrag, CdkDropList } from '@angular/cdk/drag-drop';

describe('FormBuilderComponent', () => {
  let component: FormBuilderComponent;
  let fixture: ComponentFixture<FormBuilderComponent>;
  let formServiceSpy: jasmine.SpyObj<FormService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const formServiceMock = jasmine.createSpyObj('FormService', [
      'getFormTemplate',
      'createFormTemplate',
      'updateFormTemplate'
    ]);
    
    const routerMock = jasmine.createSpyObj('Router', ['navigate']);
    
    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        ReactiveFormsModule,
        FormBuilderComponent
      ],
      providers: [
        FormBuilder,
        { provide: FormService, useValue: formServiceMock },
        { provide: Router, useValue: routerMock },
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of(convertToParamMap({})),
            url: of([])
          }
        }
      ]
    }).compileComponents();

    formServiceSpy = TestBed.inject(FormService) as jasmine.SpyObj<FormService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormBuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty form fields array', () => {
    expect(component.formFields).toEqual([]);
  });

  it('should add a new field when form is valid', () => {
    component.fieldForm.patchValue({
      type: 'text',
      label: 'Test Field',
      placeholder: 'Enter test',
      helpText: 'This is a test field',
      required: true
    });
    
    component.addField();
    
    expect(component.formFields.length).toBe(1);
    expect(component.formFields[0].type).toBe('text');
    expect(component.formFields[0].label).toBe('Test Field');
    expect(component.formFields[0].required).toBe(true);
  });

  it('should not add a field when form is invalid', () => {
    component.fieldForm.patchValue({
      type: 'text',
      label: '', // Invalid: required field
      placeholder: 'Enter test',
      helpText: 'This is a test field',
      required: true
    });
    
    component.addField();
    
    expect(component.formFields.length).toBe(0);
  });

  it('should edit an existing field', () => {
    // First add a field
    component.fieldForm.patchValue({
      type: 'text',
      label: 'Original Field',
      placeholder: 'Original placeholder',
      required: false
    });
    
    component.addField();
    
    // Now edit the field
    component.editField(0);
    
    // Modify the field
    component.fieldForm.patchValue({
      label: 'Updated Field',
      required: true
    });
    
    component.addField();
    
    expect(component.formFields.length).toBe(1);
    expect(component.formFields[0].label).toBe('Updated Field');
    expect(component.formFields[0].required).toBe(true);
    expect(component.editingFieldIndex).toBeNull();
  });

  it('should remove a field', () => {
    // Add two fields
    component.fieldForm.patchValue({
      type: 'text',
      label: 'Field 1',
      required: false
    });
    component.addField();
    
    component.fieldForm.patchValue({
      type: 'textarea',
      label: 'Field 2',
      required: true
    });
    component.addField();
    
    expect(component.formFields.length).toBe(2);
    
    // Remove the first field
    component.removeField(0);
    
    expect(component.formFields.length).toBe(1);
    expect(component.formFields[0].label).toBe('Field 2');
  });

  it('should save the form when valid', () => {
    // Set form meta data
    component.formMetaForm.patchValue({
      name: 'Test Form',
      description: 'Test Description'
    });
    
    // Add a field
    component.fieldForm.patchValue({
      type: 'text',
      label: 'Test Field',
      required: true
    });
    component.addField();
    
    formServiceSpy.createFormTemplate.and.returnValue(of({
      id: '123',
      name: 'Test Form',
      description: 'Test Description',
      fields: component.formFields,
      createdAt: new Date(),
      updatedAt: new Date()
    }));
    
    component.saveForm();
    
    expect(formServiceSpy.createFormTemplate).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/forms']);
  });
});