import { HttpClientModule } from '@angular/common/http';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { expect } from '@jest/globals';
import { of } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { SessionService } from './services/session.service';

import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;
  let router: Router;

  const isLoggedSubject = new BehaviorSubject<boolean>(false);

  const mockSessionService = {
    $isLogged: () => isLoggedSubject.asObservable(),
    logOut: jest.fn()
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientModule,
        MatToolbarModule
      ],
      declarations: [AppComponent],
      providers: [
        { provide: SessionService, useValue: mockSessionService }
      ]
    }).compileComponents();

    router = TestBed.inject(Router);
    jest.spyOn(router, 'navigate').mockResolvedValue(true);
    mockSessionService.logOut.mockClear();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  describe('when user is not logged in', () => {
    beforeEach(() => {
      isLoggedSubject.next(false);
      fixture.detectChanges();
    });

    it('should show Login and Register links', () => {
      const content = fixture.nativeElement.textContent;
      expect(content).toContain('Login');
      expect(content).toContain('Register');
    });

    it('should not show Sessions, Account and Logout links', () => {
      const content = fixture.nativeElement.textContent;
      expect(content).not.toContain('Sessions');
      expect(content).not.toContain('Account');
      expect(content).not.toContain('Logout');
    });
  });

  describe('when user is logged in', () => {
    beforeEach(() => {
      isLoggedSubject.next(true);
      fixture.detectChanges();
    });

    it('should show Sessions, Account and Logout links', () => {
      const content = fixture.nativeElement.textContent;
      expect(content).toContain('Sessions');
      expect(content).toContain('Account');
      expect(content).toContain('Logout');
    });

    it('should not show Login and Register links', () => {
      const content = fixture.nativeElement.textContent;
      expect(content).not.toContain('Login');
      expect(content).not.toContain('Register');
    });

    it('should call sessionService.logOut on logout()', () => {
      component.logout();
      expect(mockSessionService.logOut).toHaveBeenCalled();
    });

    it('should navigate to home on logout()', () => {
      component.logout();
      expect(router.navigate).toHaveBeenCalledWith(['']);
    });

    it('should hide Logout link after logout', () => {
      component.logout();
      isLoggedSubject.next(false);
      fixture.detectChanges();
      const content = fixture.nativeElement.textContent;
      expect(content).not.toContain('Logout');
    });
  });

  describe('admin user logout', () => {
    beforeEach(() => {
      isLoggedSubject.next(true);
      fixture.detectChanges();
    });

    it('should call sessionService.logOut when admin clicks logout', () => {
      component.logout();
      expect(mockSessionService.logOut).toHaveBeenCalled();
    });

    it('should navigate to home when admin logs out', () => {
      component.logout();
      expect(router.navigate).toHaveBeenCalledWith(['']);
    });
  });

  describe('non-admin user logout', () => {
    beforeEach(() => {
      isLoggedSubject.next(true);
      fixture.detectChanges();
    });

    it('should call sessionService.logOut when non-admin clicks logout', () => {
      component.logout();
      expect(mockSessionService.logOut).toHaveBeenCalled();
    });

    it('should navigate to home when non-admin logs out', () => {
      component.logout();
      expect(router.navigate).toHaveBeenCalledWith(['']);
    });
  });
});
