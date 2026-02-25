import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';
import { AuthService } from './auth.service';
import { LoginRequest } from '../interfaces/loginRequest.interface';
import { RegisterRequest } from '../interfaces/registerRequest.interface';
import { SessionInformation } from 'src/app/interfaces/sessionInformation.interface';

describe('AuthService (integration)', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  const mockLoginRequest: LoginRequest = {
    email: 'john@yoga.com',
    password: 'password123'
  };

  const mockRegisterRequest: RegisterRequest = {
    email: 'jane@yoga.com',
    firstName: 'Jane',
    lastName: 'DOE',
    password: 'password123'
  };

  const mockSessionInformation: SessionInformation = {
    token: 'fake-jwt-token',
    type: 'Bearer',
    id: 1,
    username: 'john@yoga.com',
    firstName: 'John',
    lastName: 'DOE',
    admin: false
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('login', () => {
    it('should send a POST request to api/auth/login', () => {
      service.login(mockLoginRequest).subscribe();

      const req = httpMock.expectOne('api/auth/login');
      expect(req.request.method).toBe('POST');
      req.flush(mockSessionInformation);
    });

    it('should send the login credentials in the request body', () => {
      service.login(mockLoginRequest).subscribe();

      const req = httpMock.expectOne('api/auth/login');
      expect(req.request.body).toEqual(mockLoginRequest);
      req.flush(mockSessionInformation);
    });

    it('should return session information on success', () => {
      let result: SessionInformation | undefined;

      service.login(mockLoginRequest).subscribe((data) => {
        result = data;
      });

      const req = httpMock.expectOne('api/auth/login');
      req.flush(mockSessionInformation);

      expect(result).toEqual(mockSessionInformation);
    });

    it('should return admin session information when admin logs in', () => {
      const adminSessionInfo: SessionInformation = { ...mockSessionInformation, admin: true };
      let result: SessionInformation | undefined;

      service.login(mockLoginRequest).subscribe((data) => {
        result = data;
      });

      const req = httpMock.expectOne('api/auth/login');
      req.flush(adminSessionInfo);

      expect(result?.admin).toBe(true);
    });
  });

  describe('register', () => {
    it('should send a POST request to api/auth/register', () => {
      service.register(mockRegisterRequest).subscribe();

      const req = httpMock.expectOne('api/auth/register');
      expect(req.request.method).toBe('POST');
      req.flush(null);
    });

    it('should send the register data in the request body', () => {
      service.register(mockRegisterRequest).subscribe();

      const req = httpMock.expectOne('api/auth/register');
      expect(req.request.body).toEqual(mockRegisterRequest);
      req.flush(null);
    });

    it('should complete without returning data on success', () => {
      let result: any = 'not-called';

      service.register(mockRegisterRequest).subscribe((data) => {
        result = data;
      });

      const req = httpMock.expectOne('api/auth/register');
      req.flush(null);

      expect(result).toBeNull();
    });
  });
});
