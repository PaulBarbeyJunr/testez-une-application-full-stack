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
import { Router } from '@angular/router';

import { RegisterComponent } from './register.component';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authService: AuthService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegisterComponent],
      imports: [
        RouterTestingModule,
        BrowserAnimationsModule,
        HttpClientModule,
        ReactiveFormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty form and no error', () => {
    expect(component.form.value).toEqual({
      email: '',
      firstName: '',
      lastName: '',
      password: ''
    });
    expect(component.onError).toBe(false);
  });

  it('should have invalid form when empty', () => {
    expect(component.form.valid).toBe(false);
  });

  it('should have valid form with all fields filled correctly', () => {
    component.form.setValue({
      email: 'test@test.com',
      firstName: 'John',
      lastName: 'Doe',
      password: 'password123'
    });
    expect(component.form.valid).toBe(true);
  });

  it('should require email field', () => {
    component.form.setValue({ email: '', firstName: 'John', lastName: 'Doe', password: 'password123' });
    expect(component.form.get('email')?.hasError('required')).toBe(true);
  });

  it('should reject invalid email format', () => {
    component.form.setValue({ email: 'not-an-email', firstName: 'John', lastName: 'Doe', password: 'password123' });
    expect(component.form.get('email')?.valid).toBe(false);
  });

  it('should require firstName field', () => {
    component.form.setValue({ email: 'test@test.com', firstName: '', lastName: 'Doe', password: 'password123' });
    expect(component.form.get('firstName')?.hasError('required')).toBe(true);
  });

  it('should require lastName field', () => {
    component.form.setValue({ email: 'test@test.com', firstName: 'John', lastName: '', password: 'password123' });
    expect(component.form.get('lastName')?.hasError('required')).toBe(true);
  });

  it('should require password field', () => {
    component.form.setValue({ email: 'test@test.com', firstName: 'John', lastName: 'Doe', password: '' });
    expect(component.form.get('password')?.hasError('required')).toBe(true);
  });

  it('should call authService.register and navigate to /login on success', () => {
    jest.spyOn(authService, 'register').mockReturnValue(of(undefined));
    jest.spyOn(router, 'navigate');

    component.form.setValue({
      email: 'test@test.com',
      firstName: 'John',
      lastName: 'Doe',
      password: 'password123'
    });
    component.submit();

    expect(authService.register).toHaveBeenCalledWith({
      email: 'test@test.com',
      firstName: 'John',
      lastName: 'Doe',
      password: 'password123'
    });
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should set onError to true on registration failure', () => {
    jest.spyOn(authService, 'register').mockReturnValue(throwError(() => new Error('Error')));

    component.form.setValue({
      email: 'test@test.com',
      firstName: 'John',
      lastName: 'Doe',
      password: 'password123'
    });
    component.submit();

    expect(component.onError).toBe(true);
  });
});
