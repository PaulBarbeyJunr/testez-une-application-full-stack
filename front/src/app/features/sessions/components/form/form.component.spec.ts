import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { expect } from '@jest/globals';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { SessionService } from 'src/app/services/session.service';
import { SessionApiService } from '../../services/session-api.service';
import { TeacherService } from 'src/app/services/teacher.service';
import { Session } from '../../interfaces/session.interface';

import { FormComponent } from './form.component';

describe('FormComponent', () => {
  let component: FormComponent;
  let fixture: ComponentFixture<FormComponent>;
  let sessionApiService: SessionApiService;
  let router: Router;

  const mockSessionService = {
    sessionInformation: { admin: true }
  };

  const mockSession: Session = {
    id: 1,
    name: 'Morning Yoga',
    description: 'A relaxing session',
    date: new Date('2024-01-15'),
    teacher_id: 1,
    users: [],
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const mockTeachers = [
    { id: 1, firstName: 'Margot', lastName: 'DELAHAYE', createdAt: new Date(), updatedAt: new Date() }
  ];

  describe('create mode', () => {
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [
          RouterTestingModule,
          HttpClientModule,
          MatCardModule,
          MatIconModule,
          MatFormFieldModule,
          MatInputModule,
          ReactiveFormsModule,
          MatSnackBarModule,
          MatSelectModule,
          NoopAnimationsModule
        ],
        providers: [
          { provide: SessionService, useValue: mockSessionService },
          SessionApiService,
          TeacherService
        ],
        declarations: [FormComponent]
      }).compileComponents();

      sessionApiService = TestBed.inject(SessionApiService);
      router = TestBed.inject(Router);

      const teacherService = TestBed.inject(TeacherService);
      jest.spyOn(teacherService, 'all').mockReturnValue(of(mockTeachers));

      fixture = TestBed.createComponent(FormComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize in create mode (onUpdate = false)', () => {
      expect(component.onUpdate).toBe(false);
    });

    it('should initialize form with empty fields in create mode', () => {
      expect(component.sessionForm?.value).toEqual({
        name: '',
        date: '',
        teacher_id: '',
        description: ''
      });
    });

    it('should have invalid form when empty', () => {
      expect(component.sessionForm?.valid).toBe(false);
    });

    it('should require name field', () => {
      component.sessionForm?.setValue({ name: '', date: '2024-01-15', teacher_id: 1, description: 'desc' });
      expect(component.sessionForm?.get('name')?.hasError('required')).toBe(true);
    });

    it('should require date field', () => {
      component.sessionForm?.setValue({ name: 'Yoga', date: '', teacher_id: 1, description: 'desc' });
      expect(component.sessionForm?.get('date')?.hasError('required')).toBe(true);
    });

    it('should require teacher_id field', () => {
      component.sessionForm?.setValue({ name: 'Yoga', date: '2024-01-15', teacher_id: '', description: 'desc' });
      expect(component.sessionForm?.get('teacher_id')?.hasError('required')).toBe(true);
    });

    it('should require description field', () => {
      component.sessionForm?.setValue({ name: 'Yoga', date: '2024-01-15', teacher_id: 1, description: '' });
      expect(component.sessionForm?.get('description')?.hasError('required')).toBe(true);
    });

    it('should have valid form with all fields filled', () => {
      component.sessionForm?.setValue({
        name: 'Morning Yoga',
        date: '2024-01-15',
        teacher_id: 1,
        description: 'A relaxing session'
      });
      expect(component.sessionForm?.valid).toBe(true);
    });

    it('should call sessionApiService.create and navigate on submit in create mode', () => {
      jest.spyOn(sessionApiService, 'create').mockReturnValue(of(mockSession));
      jest.spyOn(router, 'navigate');

      component.sessionForm?.setValue({
        name: 'Morning Yoga',
        date: '2024-01-15',
        teacher_id: 1,
        description: 'A relaxing session'
      });
      component.submit();

      expect(sessionApiService.create).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['sessions']);
    });

    it('should redirect non-admin to /sessions', () => {
      jest.spyOn(router, 'navigate');
      mockSessionService.sessionInformation.admin = false;
      component.ngOnInit();
      expect(router.navigate).toHaveBeenCalledWith(['/sessions']);
      mockSessionService.sessionInformation.admin = true;
    });
  });

  describe('update mode', () => {
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [
          RouterTestingModule.withRoutes([]),
          HttpClientModule,
          MatCardModule,
          MatIconModule,
          MatFormFieldModule,
          MatInputModule,
          ReactiveFormsModule,
          MatSnackBarModule,
          MatSelectModule,
          NoopAnimationsModule
        ],
        providers: [
          { provide: SessionService, useValue: mockSessionService },
          { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => '1' } } } },
          SessionApiService,
          TeacherService
        ],
        declarations: [FormComponent]
      }).compileComponents();

      sessionApiService = TestBed.inject(SessionApiService);
      router = TestBed.inject(Router);

      const teacherService = TestBed.inject(TeacherService);
      jest.spyOn(teacherService, 'all').mockReturnValue(of(mockTeachers));
      jest.spyOn(sessionApiService, 'detail').mockReturnValue(of(mockSession));

      // Simuler une URL contenant 'update'
      jest.spyOn(router, 'url', 'get').mockReturnValue('/sessions/update/1');

      fixture = TestBed.createComponent(FormComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should set onUpdate to true when URL contains update', () => {
      expect(component.onUpdate).toBe(true);
    });

    it('should call sessionApiService.detail to load session', () => {
      expect(sessionApiService.detail).toHaveBeenCalledWith('1');
    });

    it('should pre-fill form with existing session data', () => {
      expect(component.sessionForm?.get('name')?.value).toBe('Morning Yoga');
      expect(component.sessionForm?.get('description')?.value).toBe('A relaxing session');
      expect(component.sessionForm?.get('teacher_id')?.value).toBe(1);
    });

    it('should call sessionApiService.update and navigate on submit in update mode', () => {
      jest.spyOn(sessionApiService, 'update').mockReturnValue(of(mockSession));
      jest.spyOn(router, 'navigate');

      component.sessionForm?.setValue({
        name: 'Evening Yoga',
        date: '2024-02-20',
        teacher_id: 1,
        description: 'An evening session'
      });
      component.submit();

      expect(sessionApiService.update).toHaveBeenCalledWith('1', expect.objectContaining({
        name: 'Evening Yoga',
        description: 'An evening session'
      }));
      expect(router.navigate).toHaveBeenCalledWith(['sessions']);
    });

    it('should have valid form with pre-filled data', () => {
      expect(component.sessionForm?.valid).toBe(true);
    });
  });
});
