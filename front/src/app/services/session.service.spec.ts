import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';
import { SessionService } from './session.service';
import { SessionInformation } from '../interfaces/sessionInformation.interface';

describe('SessionService', () => {
  let service: SessionService;

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
    TestBed.configureTestingModule({});
    service = TestBed.inject(SessionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be logged out by default', () => {
    expect(service.isLogged).toBe(false);
  });

  it('should have no session information by default', () => {
    expect(service.sessionInformation).toBeUndefined();
  });

  describe('logIn', () => {
    it('should set isLogged to true', () => {
      service.logIn(mockSessionInformation);
      expect(service.isLogged).toBe(true);
    });

    it('should store session information', () => {
      service.logIn(mockSessionInformation);
      expect(service.sessionInformation).toEqual(mockSessionInformation);
    });

    it('should store admin session information', () => {
      const adminSession: SessionInformation = { ...mockSessionInformation, admin: true };
      service.logIn(adminSession);
      expect(service.sessionInformation?.admin).toBe(true);
    });
  });

  describe('logOut', () => {
    it('should set isLogged to false', () => {
      service.logIn(mockSessionInformation);
      service.logOut();
      expect(service.isLogged).toBe(false);
    });

    it('should clear session information', () => {
      service.logIn(mockSessionInformation);
      service.logOut();
      expect(service.sessionInformation).toBeUndefined();
    });
  });

  describe('$isLogged', () => {
    it('should emit false by default', (done) => {
      service.$isLogged().subscribe((value) => {
        expect(value).toBe(false);
        done();
      });
    });

    it('should emit true after logIn', (done) => {
      service.logIn(mockSessionInformation);
      service.$isLogged().subscribe((value) => {
        expect(value).toBe(true);
        done();
      });
    });

    it('should emit false after logOut', (done) => {
      service.logIn(mockSessionInformation);
      service.logOut();
      service.$isLogged().subscribe((value) => {
        expect(value).toBe(false);
        done();
      });
    });
  });
});
