import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterTestingModule } from '@angular/router/testing';
import { expect } from '@jest/globals';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { SessionService } from 'src/app/services/session.service';
import { SessionApiService } from '../../services/session-api.service';
import { Session } from '../../interfaces/session.interface';

import { ListComponent } from './list.component';

describe('ListComponent', () => {
  let component: ListComponent;
  let fixture: ComponentFixture<ListComponent>;
  let sessionApiService: SessionApiService;

  const mockSessions: Session[] = [
    {
      id: 1,
      name: 'Morning Yoga',
      description: 'A relaxing morning yoga session',
      date: new Date('2024-01-15'),
      teacher_id: 1,
      users: [],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 2,
      name: 'Evening Yoga',
      description: 'A calming evening yoga session',
      date: new Date('2024-01-16'),
      teacher_id: 2,
      users: [],
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  const mockAdminSessionService = {
    sessionInformation: { admin: true, id: 1 }
  };

  const mockUserSessionService = {
    sessionInformation: { admin: false, id: 2 }
  };

  describe('as admin user', () => {
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        declarations: [ListComponent],
        imports: [HttpClientModule, MatCardModule, MatIconModule, RouterTestingModule],
        providers: [
          { provide: SessionService, useValue: mockAdminSessionService },
          SessionApiService
        ]
      }).compileComponents();

      sessionApiService = TestBed.inject(SessionApiService);
      jest.spyOn(sessionApiService, 'all').mockReturnValue(of(mockSessions));

      fixture = TestBed.createComponent(ListComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should display the list of sessions', () => {
      const sessionCards = fixture.debugElement.queryAll(By.css('mat-card.item'));
      expect(sessionCards.length).toBe(2);
    });

    it('should display session names', () => {
      const sessionCards = fixture.debugElement.queryAll(By.css('mat-card.item'));
      expect(sessionCards[0].nativeElement.textContent).toContain('Morning Yoga');
      expect(sessionCards[1].nativeElement.textContent).toContain('Evening Yoga');
    });

    it('should show Create button for admin', () => {
      const createButton = fixture.debugElement.query(By.css('button[routerLink="create"]'));
      expect(createButton).toBeTruthy();
    });

    it('should show Edit buttons for admin', () => {
      const editButtons = fixture.debugElement.queryAll(By.css('button[ng-reflect-router-link]'));
      expect(editButtons.length).toBeGreaterThan(0);
    });

    it('should show Detail button for each session', () => {
      const detailButtons = fixture.debugElement.queryAll(By.css('mat-card.item button'));
      const detailTexts = detailButtons.map(b => b.nativeElement.textContent);
      expect(detailTexts.some((t: string) => t.includes('Detail'))).toBe(true);
    });

    it('should return user info from sessionService', () => {
      expect(component.user).toEqual({ admin: true, id: 1 });
    });
  });

  describe('as non-admin user', () => {
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        declarations: [ListComponent],
        imports: [HttpClientModule, MatCardModule, MatIconModule, RouterTestingModule],
        providers: [
          { provide: SessionService, useValue: mockUserSessionService },
          SessionApiService
        ]
      }).compileComponents();

      sessionApiService = TestBed.inject(SessionApiService);
      jest.spyOn(sessionApiService, 'all').mockReturnValue(of(mockSessions));

      fixture = TestBed.createComponent(ListComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should not show Create button for non-admin', () => {
      const createButton = fixture.debugElement.query(By.css('button[routerLink="create"]'));
      expect(createButton).toBeNull();
    });

    it('should still display the list of sessions', () => {
      const sessionCards = fixture.debugElement.queryAll(By.css('mat-card.item'));
      expect(sessionCards.length).toBe(2);
    });
  });
});
