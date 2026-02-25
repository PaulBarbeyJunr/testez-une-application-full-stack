import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';
import { TeacherService } from './teacher.service';
import { Teacher } from '../interfaces/teacher.interface';

describe('TeacherService (integration)', () => {
  let service: TeacherService;
  let httpMock: HttpTestingController;

  const mockTeacher: Teacher = {
    id: 1,
    firstName: 'Margot',
    lastName: 'DELAHAYE',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-10')
  };

  const mockTeachers: Teacher[] = [
    mockTeacher,
    {
      id: 2,
      firstName: 'Hélène',
      lastName: 'THIERCELIN',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-10')
    }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TeacherService]
    });

    service = TestBed.inject(TeacherService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('all', () => {
    it('should send a GET request to api/teacher', () => {
      service.all().subscribe();

      const req = httpMock.expectOne('api/teacher');
      expect(req.request.method).toBe('GET');
      req.flush(mockTeachers);
    });

    it('should return the list of teachers', () => {
      let result: Teacher[] = [];

      service.all().subscribe((data) => {
        result = data;
      });

      const req = httpMock.expectOne('api/teacher');
      req.flush(mockTeachers);

      expect(result.length).toBe(2);
      expect(result[0].firstName).toBe('Margot');
      expect(result[1].firstName).toBe('Hélène');
    });
  });

  describe('detail', () => {
    it('should send a GET request to api/teacher/:id', () => {
      service.detail('1').subscribe();

      const req = httpMock.expectOne('api/teacher/1');
      expect(req.request.method).toBe('GET');
      req.flush(mockTeacher);
    });

    it('should return the teacher detail', () => {
      let result: Teacher | undefined;

      service.detail('1').subscribe((data) => {
        result = data;
      });

      const req = httpMock.expectOne('api/teacher/1');
      req.flush(mockTeacher);

      expect(result?.firstName).toBe('Margot');
      expect(result?.lastName).toBe('DELAHAYE');
    });

    it('should target the correct teacher id in the URL', () => {
      service.detail('2').subscribe();

      const req = httpMock.expectOne('api/teacher/2');
      expect(req.request.method).toBe('GET');
      req.flush(mockTeachers[1]);
    });
  });
});
