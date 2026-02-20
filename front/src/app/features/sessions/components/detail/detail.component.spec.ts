import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';
import { expect } from '@jest/globals';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { SessionService } from '../../../../services/session.service';
import { SessionApiService } from '../../services/session-api.service';
import { TeacherService } from '../../../../services/teacher.service';
import { Session } from '../../interfaces/session.interface';
import { Teacher } from '../../../../interfaces/teacher.interface';

import { DetailComponent } from './detail.component';

describe('DetailComponent', () => {
  let component: DetailComponent;
  let fixture: ComponentFixture<DetailComponent>;
  let sessionApiService: SessionApiService;
  let teacherService: TeacherService;

  const mockSession: Session = {
    id: 1,
    name: 'Morning Yoga',
    description: 'A relaxing morning yoga session',
    date: new Date('2024-01-15'),
    teacher_id: 1,
    users: [1],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-10')
  };

  const mockTeacher: Teacher = {
    id: 1,
    firstName: 'Margot',
    lastName: 'DELAHAYE',
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const mockAdminSessionService = {
    sessionInformation: { admin: true, id: 1 }
  };

  const mockUserSessionService = {
    sessionInformation: { admin: false, id: 2 }
  };

  function createComponent(sessionServiceMock: any) {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientModule,
        MatSnackBarModule,
        MatCardModule,
        MatIconModule,
        ReactiveFormsModule
      ],
      declarations: [DetailComponent],
      providers: [
        { provide: SessionService, useValue: sessionServiceMock },
        SessionApiService,
        TeacherService
      ]
    }).compileComponents();

    sessionApiService = TestBed.inject(SessionApiService);
    teacherService = TestBed.inject(TeacherService);

    jest.spyOn(sessionApiService, 'detail').mockReturnValue(of(mockSession));
    jest.spyOn(teacherService, 'detail').mockReturnValue(of(mockTeacher));

    fixture = TestBed.createComponent(DetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  describe('as admin user', () => {
    beforeEach(async () => {
      await createComponent(mockAdminSessionService);
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should display session name', () => {
      const title = fixture.debugElement.query(By.css('h1'));
      expect(title.nativeElement.textContent).toContain('Morning Yoga');
    });

    it('should display session description', () => {
      const content = fixture.debugElement.query(By.css('.description'));
      expect(content.nativeElement.textContent).toContain('A relaxing morning yoga session');
    });

    it('should display number of attendees', () => {
      const content = fixture.nativeElement.textContent;
      expect(content).toContain('1 attendees');
    });

    it('should display teacher name', () => {
      const content = fixture.nativeElement.textContent;
      expect(content).toContain('Margot');
      expect(content).toContain('DELAHAYE');
    });

    it('should show Delete button for admin', () => {
      const deleteButton = fixture.debugElement.query(By.css('button[color="warn"]'));
      expect(deleteButton).toBeTruthy();
      expect(deleteButton.nativeElement.textContent).toContain('Delete');
    });

    it('should not show Participate button for admin', () => {
      const content = fixture.nativeElement.textContent;
      expect(content).not.toContain('Participate');
    });

    it('should set isAdmin to true', () => {
      expect(component.isAdmin).toBe(true);
    });
  });

  describe('as non-admin user', () => {
    beforeEach(async () => {
      await createComponent(mockUserSessionService);
    });

    it('should not show Delete button for non-admin', () => {
      const buttons = fixture.debugElement.queryAll(By.css('button'));
      const deleteBtn = buttons.find(b => b.nativeElement.textContent.includes('Delete'));
      expect(deleteBtn).toBeUndefined();
    });

    it('should show Participate button when user is not participating', () => {
      component.isParticipate = false;
      fixture.detectChanges();
      const content = fixture.nativeElement.textContent;
      expect(content).toContain('Participate');
    });

    it('should show Do not participate button when user is participating', () => {
      component.isParticipate = true;
      fixture.detectChanges();
      const content = fixture.nativeElement.textContent;
      expect(content).toContain('Do not participate');
    });

    it('should set isAdmin to false', () => {
      expect(component.isAdmin).toBe(false);
    });
  });
});
