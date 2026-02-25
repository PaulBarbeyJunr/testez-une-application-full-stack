import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { expect } from '@jest/globals';
import { of } from 'rxjs';
import { SessionService } from 'src/app/services/session.service';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/interfaces/user.interface';

import { MeComponent } from './me.component';

describe('MeComponent', () => {
  let component: MeComponent;
  let fixture: ComponentFixture<MeComponent>;
  let userService: UserService;
  let matSnackBar: MatSnackBar;
  let router: any;

  const mockUser: User = {
    id: 1,
    email: 'john@yoga.com',
    firstName: 'John',
    lastName: 'DOE',
    admin: false,
    password: 'password',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-10')
  };

  const mockAdminUser: User = {
    ...mockUser,
    id: 2,
    email: 'admin@yoga.com',
    admin: true
  };

  const mockSessionService = {
    sessionInformation: { admin: false, id: 1 },
    logOut: jest.fn().mockReturnValue(undefined)
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MeComponent],
      imports: [
        RouterTestingModule,
        MatSnackBarModule,
        HttpClientModule,
        MatCardModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule
      ],
      providers: [
        { provide: SessionService, useValue: mockSessionService },
        UserService
      ],
    }).compileComponents();

    userService = TestBed.inject(UserService);
    matSnackBar = TestBed.inject(MatSnackBar);
    router = TestBed.inject(Router);
    jest.spyOn(router, 'navigate').mockResolvedValue(true);

    jest.spyOn(userService, 'getById').mockReturnValue(of(mockUser));

    fixture = TestBed.createComponent(MeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call userService.getById on init', () => {
    expect(userService.getById).toHaveBeenCalledWith('1');
  });

  it('should display user first name and last name', () => {
    const content = fixture.nativeElement.textContent;
    expect(content).toContain('John');
    expect(content).toContain('DOE');
  });

  it('should display user email', () => {
    const content = fixture.nativeElement.textContent;
    expect(content).toContain('john@yoga.com');
  });

  it('should not display "You are admin" for non-admin user', () => {
    const content = fixture.nativeElement.textContent;
    expect(content).not.toContain('You are admin');
  });

  it('should show Delete button for non-admin user', () => {
    const deleteButton = fixture.nativeElement.querySelector('button[color="warn"]');
    expect(deleteButton).toBeTruthy();
  });

  it('should display "You are admin" for admin user', () => {
    jest.spyOn(userService, 'getById').mockReturnValue(of(mockAdminUser));
    component.ngOnInit();
    fixture.detectChanges();
    const content = fixture.nativeElement.textContent;
    expect(content).toContain('You are admin');
  });

  it('should not show Delete button for admin user', () => {
    jest.spyOn(userService, 'getById').mockReturnValue(of(mockAdminUser));
    component.ngOnInit();
    fixture.detectChanges();
    const deleteButton = fixture.nativeElement.querySelector('button[color="warn"]');
    expect(deleteButton).toBeNull();
  });

  it('should call userService.delete and show snackbar on delete', () => {
    jest.spyOn(userService, 'delete').mockReturnValue(of({}));
    jest.spyOn(matSnackBar, 'open');

    component.delete();

    expect(userService.delete).toHaveBeenCalledWith('1');
    expect(matSnackBar.open).toHaveBeenCalledWith(
      'Your account has been deleted !', 'Close', { duration: 3000 }
    );
  });

  it('should call sessionService.logOut on delete', () => {
    jest.spyOn(userService, 'delete').mockReturnValue(of({}));
    jest.spyOn(matSnackBar, 'open').mockReturnValue({} as any);
    mockSessionService.logOut.mockClear();

    component.delete();

    expect(mockSessionService.logOut).toHaveBeenCalled();
  });
});
