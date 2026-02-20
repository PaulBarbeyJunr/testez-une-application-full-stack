import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { expect } from '@jest/globals';
import { of, throwError } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { SessionService } from 'src/app/services/session.service';
import { Router } from '@angular/router';

import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: AuthService;
  let sessionService: SessionService;
  let router: Router;

  const mockSessionInformation = {
    token: 'fake-token',
    type: 'Bearer',
    id: 1,
    username: 'yoga@studio.com',
    firstName: 'Admin',
    lastName: 'Admin',
    admin: true
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      providers: [SessionService, AuthService],
      imports: [
        RouterTestingModule,
        BrowserAnimationsModule,
        HttpClientModule,
        MatCardModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    sessionService = TestBed.inject(SessionService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty form and no error', () => {
    expect(component.form.value).toEqual({ email: '', password: '' });
    expect(component.onError).toBe(false);
    expect(component.hide).toBe(true);
  });

  it('should have invalid form when empty', () => {
    expect(component.form.valid).toBe(false);
  });

  it('should have invalid form with wrong email format', () => {
    component.form.setValue({ email: 'not-an-email', password: 'password123' });
    expect(component.form.get('email')?.valid).toBe(false);
  });

  it('should have valid form with correct credentials', () => {
    component.form.setValue({ email: 'yoga@studio.com', password: 'test!1234' });
    expect(component.form.valid).toBe(true);
  });

  it('should call authService.login and navigate to /sessions on success', () => {
    jest.spyOn(authService, 'login').mockReturnValue(of(mockSessionInformation));
    jest.spyOn(sessionService, 'logIn');
    jest.spyOn(router, 'navigate');

    component.form.setValue({ email: 'yoga@studio.com', password: 'test!1234' });
    component.submit();

    expect(authService.login).toHaveBeenCalledWith({ email: 'yoga@studio.com', password: 'test!1234' });
    expect(sessionService.logIn).toHaveBeenCalledWith(mockSessionInformation);
    expect(router.navigate).toHaveBeenCalledWith(['/sessions']);
  });

  it('should set onError to true on login failure', () => {
    jest.spyOn(authService, 'login').mockReturnValue(throwError(() => new Error('Unauthorized')));

    component.form.setValue({ email: 'wrong@email.com', password: 'wrongpassword' });
    component.submit();

    expect(component.onError).toBe(true);
  });

  it('should require email field', () => {
    component.form.setValue({ email: '', password: 'test!1234' });
    expect(component.form.get('email')?.hasError('required')).toBe(true);
  });

  it('should require password field', () => {
    component.form.setValue({ email: 'yoga@studio.com', password: '' });
    expect(component.form.get('password')?.hasError('required')).toBe(true);
  });
});
