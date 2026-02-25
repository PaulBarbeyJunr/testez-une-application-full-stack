import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';
import { SessionApiService } from './session-api.service';
import { Session } from '../interfaces/session.interface';

describe('SessionApiService (integration)', () => {
  let service: SessionApiService;
  let httpMock: HttpTestingController;

  const mockSession: Session = {
    id: 1,
    name: 'Morning Yoga',
    description: 'A relaxing session',
    date: new Date('2024-01-15'),
    teacher_id: 1,
    users: [2, 3],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-10')
  };

  const mockSessions: Session[] = [
    mockSession,
    {
      id: 2,
      name: 'Evening Yoga',
      description: 'A calming session',
      date: new Date('2024-01-16'),
      teacher_id: 2,
      users: [],
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-10')
    }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SessionApiService]
    });

    service = TestBed.inject(SessionApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('all', () => {
    it('should send a GET request to api/session', () => {
      service.all().subscribe();

      const req = httpMock.expectOne('api/session');
      expect(req.request.method).toBe('GET');
      req.flush(mockSessions);
    });

    it('should return the list of sessions', () => {
      let result: Session[] = [];

      service.all().subscribe((data) => {
        result = data;
      });

      const req = httpMock.expectOne('api/session');
      req.flush(mockSessions);

      expect(result.length).toBe(2);
      expect(result[0].name).toBe('Morning Yoga');
    });
  });

  describe('detail', () => {
    it('should send a GET request to api/session/:id', () => {
      service.detail('1').subscribe();

      const req = httpMock.expectOne('api/session/1');
      expect(req.request.method).toBe('GET');
      req.flush(mockSession);
    });

    it('should return the session detail', () => {
      let result: Session | undefined;

      service.detail('1').subscribe((data) => {
        result = data;
      });

      const req = httpMock.expectOne('api/session/1');
      req.flush(mockSession);

      expect(result?.name).toBe('Morning Yoga');
      expect(result?.teacher_id).toBe(1);
    });
  });

  describe('create', () => {
    it('should send a POST request to api/session', () => {
      service.create(mockSession).subscribe();

      const req = httpMock.expectOne('api/session');
      expect(req.request.method).toBe('POST');
      req.flush(mockSession);
    });

    it('should send the session data in the request body', () => {
      service.create(mockSession).subscribe();

      const req = httpMock.expectOne('api/session');
      expect(req.request.body).toEqual(mockSession);
      req.flush(mockSession);
    });

    it('should return the created session', () => {
      let result: Session | undefined;

      service.create(mockSession).subscribe((data) => {
        result = data;
      });

      const req = httpMock.expectOne('api/session');
      req.flush(mockSession);

      expect(result?.id).toBe(1);
      expect(result?.name).toBe('Morning Yoga');
    });
  });

  describe('update', () => {
    it('should send a PUT request to api/session/:id', () => {
      service.update('1', mockSession).subscribe();

      const req = httpMock.expectOne('api/session/1');
      expect(req.request.method).toBe('PUT');
      req.flush(mockSession);
    });

    it('should send the updated session data in the request body', () => {
      const updatedSession = { ...mockSession, name: 'Updated Yoga' };
      service.update('1', updatedSession).subscribe();

      const req = httpMock.expectOne('api/session/1');
      expect(req.request.body.name).toBe('Updated Yoga');
      req.flush(updatedSession);
    });

    it('should return the updated session', () => {
      const updatedSession = { ...mockSession, name: 'Updated Yoga' };
      let result: Session | undefined;

      service.update('1', updatedSession).subscribe((data) => {
        result = data;
      });

      const req = httpMock.expectOne('api/session/1');
      req.flush(updatedSession);

      expect(result?.name).toBe('Updated Yoga');
    });
  });

  describe('delete', () => {
    it('should send a DELETE request to api/session/:id', () => {
      service.delete('1').subscribe();

      const req = httpMock.expectOne('api/session/1');
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });
  });

  describe('participate', () => {
    it('should send a POST request to api/session/:id/participate/:userId', () => {
      service.participate('1', '2').subscribe();

      const req = httpMock.expectOne('api/session/1/participate/2');
      expect(req.request.method).toBe('POST');
      req.flush(null);
    });

    it('should send a null body for participate', () => {
      service.participate('1', '2').subscribe();

      const req = httpMock.expectOne('api/session/1/participate/2');
      expect(req.request.body).toBeNull();
      req.flush(null);
    });
  });

  describe('unParticipate', () => {
    it('should send a DELETE request to api/session/:id/participate/:userId', () => {
      service.unParticipate('1', '2').subscribe();

      const req = httpMock.expectOne('api/session/1/participate/2');
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });
  });
});
