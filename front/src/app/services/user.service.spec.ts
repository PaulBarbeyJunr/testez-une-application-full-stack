import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';
import { UserService } from './user.service';
import { User } from '../interfaces/user.interface';

describe('UserService (integration)', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  const mockUser: User = {
    id: 1,
    email: 'john@yoga.com',
    firstName: 'John',
    lastName: 'DOE',
    admin: false,
    password: 'password123',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-10')
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService]
    });

    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getById', () => {
    it('should send a GET request to api/user/:id', () => {
      service.getById('1').subscribe();

      const req = httpMock.expectOne('api/user/1');
      expect(req.request.method).toBe('GET');
      req.flush(mockUser);
    });

    it('should return the user data', () => {
      let result: User | undefined;

      service.getById('1').subscribe((data) => {
        result = data;
      });

      const req = httpMock.expectOne('api/user/1');
      req.flush(mockUser);

      expect(result?.firstName).toBe('John');
      expect(result?.email).toBe('john@yoga.com');
      expect(result?.admin).toBe(false);
    });

    it('should return admin user data when user is admin', () => {
      const adminUser: User = { ...mockUser, admin: true };
      let result: User | undefined;

      service.getById('1').subscribe((data) => {
        result = data;
      });

      const req = httpMock.expectOne('api/user/1');
      req.flush(adminUser);

      expect(result?.admin).toBe(true);
    });
  });

  describe('delete', () => {
    it('should send a DELETE request to api/user/:id', () => {
      service.delete('1').subscribe();

      const req = httpMock.expectOne('api/user/1');
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });

    it('should target the correct user id in the URL', () => {
      service.delete('42').subscribe();

      const req = httpMock.expectOne('api/user/42');
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });
  });
});
