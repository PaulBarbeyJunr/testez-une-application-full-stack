export {};

// ─── Shared data ────────────────────────────────────────────────────────────

const mockAdminUser = {
  id: 1,
  email: 'yoga@studio.com',
  firstName: 'Admin',
  lastName: 'User',
  admin: true,
  password: '',
  createdAt: new Date('2024-01-01').toISOString(),
  updatedAt: new Date('2024-06-01').toISOString()
};

const mockRegularUser = {
  id: 2,
  email: 'user@test.com',
  firstName: 'Regular',
  lastName: 'User',
  admin: false,
  password: '',
  createdAt: new Date('2024-02-01').toISOString(),
  updatedAt: new Date('2024-06-01').toISOString()
};

const mockTeachers = [
  { id: 1, firstName: 'John', lastName: 'Doe', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 2, firstName: 'Jane', lastName: 'Smith', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
];

const mockTeacher = mockTeachers[0];

const mockSession = {
  id: 1,
  name: 'Morning Yoga',
  description: 'A relaxing morning yoga session',
  date: new Date('2024-06-15').toISOString(),
  teacher_id: 1,
  users: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

const mockSessionWithUser = { ...mockSession, users: [2] };

const mockSessions = [
  mockSession,
  {
    id: 2,
    name: 'Evening Stretch',
    description: 'An evening stretching session',
    date: new Date('2024-06-20').toISOString(),
    teacher_id: 2,
    users: [1],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// ─── Helpers ────────────────────────────────────────────────────────────────

const loginAs = (admin: boolean) => {
  const user = admin ? mockAdminUser : mockRegularUser;
  cy.visit('/login');
  cy.intercept('POST', '/api/auth/login', {
    body: { id: user.id, username: user.email, firstName: user.firstName, lastName: user.lastName, admin: user.admin }
  });
  cy.intercept('GET', '/api/session', [mockSession]).as('sessions');
  cy.intercept('GET', '/api/teacher', mockTeachers).as('teachers');
  cy.get('input[formControlName=email]').type(user.email);
  cy.get('input[formControlName=password]').type('test!1234');
  cy.get('button[type=submit]').click();
  cy.url().should('include', '/sessions');
};

const loginAndGoToDetail = (admin: boolean, sessionData = mockSession) => {
  cy.visit('/login');
  cy.intercept('POST', '/api/auth/login', {
    body: { id: admin ? 1 : 2, username: admin ? 'yoga@studio.com' : 'user@test.com', firstName: admin ? 'Admin' : 'Regular', lastName: 'User', admin }
  });
  cy.intercept('GET', '/api/session', [sessionData]).as('sessions');
  cy.intercept('GET', '/api/session/1', sessionData).as('sessionDetail');
  cy.intercept('GET', '/api/teacher/1', mockTeacher).as('teacher');
  cy.get('input[formControlName=email]').type(admin ? 'yoga@studio.com' : 'user@test.com');
  cy.get('input[formControlName=password]').type('test!1234');
  cy.get('button[type=submit]').click();
  cy.url().should('include', '/sessions');
  cy.contains('button', 'Detail').first().click();
  cy.url().should('include', '/sessions/detail/1');
};

// ─── Login ───────────────────────────────────────────────────────────────────

describe('Login spec', () => {
  it('Login successful', () => {
    cy.visit('/login');
    cy.intercept('POST', '/api/auth/login', {
      body: { id: 1, username: 'userName', firstName: 'firstName', lastName: 'lastName', admin: true }
    });
    cy.intercept('GET', '/api/session', []).as('session');
    cy.get('input[formControlName=email]').type('yoga@studio.com');
    cy.get('input[formControlName=password]').type('test!1234');
    cy.get('button[type=submit]').click();
    cy.url().should('include', '/sessions');
  });

  it('Login failed', () => {
    cy.visit('/login');
    cy.intercept('POST', '/api/auth/login', { statusCode: 401, body: { message: 'Invalid credentials' } });
    cy.get('input[formControlName=email]').type('wrong@email.com');
    cy.get('input[formControlName=password]').type('wrongpassword');
    cy.get('button[type=submit]').click();
    cy.get('.error').should('be.visible').and('contain', 'An error occurred');
    cy.url().should('include', '/login');
  });
});

// ─── Register ────────────────────────────────────────────────────────────────

describe('Register spec', () => {
  it('Register successful', () => {
    cy.visit('/register');
    cy.intercept('POST', '/api/auth/register', { statusCode: 200, body: {} });
    cy.get('input[formControlName=firstName]').type('John');
    cy.get('input[formControlName=lastName]').type('Doe');
    cy.get('input[formControlName=email]').type('john.doe@test.com');
    cy.get('input[formControlName=password]').type('test!1234');
    cy.get('button[type=submit]').click();
    cy.url().should('include', '/login');
  });

  it('Register failed', () => {
    cy.visit('/register');
    cy.intercept('POST', '/api/auth/register', { statusCode: 400, body: { message: 'Email already exists' } });
    cy.get('input[formControlName=firstName]').type('John');
    cy.get('input[formControlName=lastName]').type('Doe');
    cy.get('input[formControlName=email]').type('existing@test.com');
    cy.get('input[formControlName=password]').type('test!1234');
    cy.get('button[type=submit]').click();
    cy.get('.error').should('be.visible').and('contain', 'An error occurred');
    cy.url().should('include', '/register');
  });

  it('Submit button disabled when form is invalid', () => {
    cy.visit('/register');
    cy.get('button[type=submit]').should('be.disabled');
    cy.get('input[formControlName=firstName]').type('John');
    cy.get('button[type=submit]').should('be.disabled');
    cy.get('input[formControlName=lastName]').type('Doe');
    cy.get('input[formControlName=email]').type('john.doe@test.com');
    cy.get('input[formControlName=password]').type('test!1234');
    cy.get('button[type=submit]').should('not.be.disabled');
  });
});

// ─── Sessions list ───────────────────────────────────────────────────────────

describe('Sessions list spec', () => {
  it('Admin sees sessions list with Create button', () => {
    cy.visit('/login');
    cy.intercept('POST', '/api/auth/login', {
      body: { id: 1, username: 'yoga@studio.com', firstName: 'Admin', lastName: 'User', admin: true }
    });
    cy.intercept('GET', '/api/session', mockSessions).as('sessions');
    cy.get('input[formControlName=email]').type('yoga@studio.com');
    cy.get('input[formControlName=password]').type('test!1234');
    cy.get('button[type=submit]').click();
    cy.url().should('include', '/sessions');
    cy.get('mat-card-title').should('contain', 'Rentals available');
    cy.contains('button', 'Create').should('be.visible');
    cy.get('mat-card.item').should('have.length', 2);
  });

  it('User sees sessions list without Create button', () => {
    cy.visit('/login');
    cy.intercept('POST', '/api/auth/login', {
      body: { id: 2, username: 'user@test.com', firstName: 'Regular', lastName: 'User', admin: false }
    });
    cy.intercept('GET', '/api/session', mockSessions).as('sessions');
    cy.get('input[formControlName=email]').type('user@test.com');
    cy.get('input[formControlName=password]').type('test!1234');
    cy.get('button[type=submit]').click();
    cy.url().should('include', '/sessions');
    cy.contains('button', 'Create').should('not.exist');
    cy.get('mat-card.item').should('have.length', 2);
  });

  it('Logout redirects to home', () => {
    cy.visit('/login');
    cy.intercept('POST', '/api/auth/login', {
      body: { id: 1, username: 'yoga@studio.com', firstName: 'Admin', lastName: 'User', admin: true }
    });
    cy.intercept('GET', '/api/session', mockSessions).as('sessions');
    cy.get('input[formControlName=email]').type('yoga@studio.com');
    cy.get('input[formControlName=password]').type('test!1234');
    cy.get('button[type=submit]').click();
    cy.url().should('include', '/sessions');
    cy.get('span.link').contains('Logout').click();
    cy.url().should('not.include', '/sessions');
    cy.get('span.link').contains('Login').should('be.visible');
  });
});

// ─── Session detail ──────────────────────────────────────────────────────────

describe('Session detail spec', () => {
  it('Admin sees session detail with Delete button', () => {
    loginAndGoToDetail(true);
    cy.get('h1').should('contain', 'Morning Yoga');
    cy.contains('button', 'Delete').should('be.visible');
    cy.contains('button', 'Participate').should('not.exist');
  });

  it('Admin can delete a session', () => {
    loginAndGoToDetail(true);
    cy.intercept('DELETE', '/api/session/1', { statusCode: 200 }).as('deleteSession');
    cy.intercept('GET', '/api/session', []).as('sessionsEmpty');
    cy.contains('button', 'Delete').click();
    cy.wait('@deleteSession');
    cy.url().should('include', '/sessions');
  });

  it('User sees Participate button when not participating', () => {
    loginAndGoToDetail(false);
    cy.get('h1').should('contain', 'Morning Yoga');
    cy.contains('button', 'Participate').should('be.visible');
    cy.contains('button', 'Delete').should('not.exist');
  });

  it('User can participate in a session', () => {
    loginAndGoToDetail(false);
    cy.intercept('POST', '/api/session/1/participate/2', { statusCode: 200 }).as('participate');
    cy.intercept('GET', '/api/session/1', mockSessionWithUser).as('sessionUpdated');
    cy.contains('button', 'Participate').click();
    cy.wait('@participate');
    cy.contains('button', 'Do not participate').should('be.visible');
  });

  it('User can unparticipate from a session', () => {
    loginAndGoToDetail(false, mockSessionWithUser);
    cy.intercept('DELETE', '/api/session/1/participate/2', { statusCode: 200 }).as('unparticipate');
    cy.intercept('GET', '/api/session/1', mockSession).as('sessionUpdated');
    cy.contains('button', 'Do not participate').click();
    cy.wait('@unparticipate');
    cy.contains('button', 'Participate').should('be.visible');
  });

  it('Back button navigates to previous page', () => {
    loginAndGoToDetail(true);
    cy.get('button[mat-icon-button]').first().click();
    cy.url().should('include', '/sessions');
  });
});

// ─── Session form ─────────────────────────────────────────────────────────────

describe('Session form spec', () => {
  it('Admin can navigate to create session form', () => {
    loginAs(true);
    cy.contains('button', 'Create').click();
    cy.url().should('include', '/sessions/create');
    cy.get('h1').should('contain', 'Create session');
  });

  it('Create form has all required fields', () => {
    loginAs(true);
    cy.contains('button', 'Create').click();
    cy.url().should('include', '/sessions/create');
    cy.get('input[formControlName=name]').should('be.visible');
    cy.get('input[formControlName=date]').should('be.visible');
    cy.get('mat-select[formControlName=teacher_id]').should('be.visible');
    cy.get('textarea[formControlName=description]').should('be.visible');
    cy.get('button[type=submit]').should('be.disabled');
  });

  it('Admin can create a session', () => {
    loginAs(true);
    cy.intercept('POST', '/api/session', { statusCode: 200, body: mockSession }).as('createSession');
    cy.intercept('GET', '/api/session', [mockSession]).as('sessionsUpdated');
    cy.contains('button', 'Create').click();
    cy.url().should('include', '/sessions/create');
    cy.get('input[formControlName=name]').type('New Yoga Session');
    cy.get('input[formControlName=date]').type('2024-07-01');
    cy.get('mat-select[formControlName=teacher_id]').click();
    cy.get('mat-option').first().click();
    cy.get('textarea[formControlName=description]').type('A great yoga session');
    cy.get('button[type=submit]').should('not.be.disabled');
    cy.get('button[type=submit]').click();
    cy.wait('@createSession');
    cy.url().should('include', '/sessions');
  });

  it('Admin can navigate to update session form', () => {
    cy.intercept('GET', '/api/session/1', mockSession).as('sessionDetail');
    cy.intercept('GET', '/api/teacher', mockTeachers).as('teachers');
    loginAs(true);
    cy.contains('button', 'Edit').first().click();
    cy.url().should('include', '/sessions/update/1');
    cy.get('h1').should('contain', 'Update session');
  });

  it('Update form is pre-filled with session data', () => {
    cy.intercept('GET', '/api/session/1', mockSession).as('sessionDetail');
    cy.intercept('GET', '/api/teacher', mockTeachers).as('teachers');
    loginAs(true);
    cy.contains('button', 'Edit').first().click();
    cy.wait('@sessionDetail');
    cy.get('input[formControlName=name]').should('have.value', 'Morning Yoga');
    cy.get('textarea[formControlName=description]').should('have.value', 'A relaxing morning yoga session');
  });

  it('Admin can update a session', () => {
    cy.intercept('GET', '/api/session/1', mockSession).as('sessionDetail');
    cy.intercept('GET', '/api/teacher', mockTeachers).as('teachers');
    cy.intercept('PUT', '/api/session/1', { statusCode: 200, body: { ...mockSession, name: 'Updated Yoga' } }).as('updateSession');
    cy.intercept('GET', '/api/session', [mockSession]).as('sessionsUpdated');
    loginAs(true);
    cy.contains('button', 'Edit').first().click();
    cy.wait('@sessionDetail');
    cy.get('input[formControlName=name]').clear().type('Updated Yoga');
    cy.get('button[type=submit]').click();
    cy.wait('@updateSession');
    cy.url().should('include', '/sessions');
  });
});

// ─── Me (profile) ────────────────────────────────────────────────────────────

describe('Me (profile) spec', () => {
  it('Admin profile displays correct information', () => {
    cy.intercept('GET', '/api/user/1', mockAdminUser).as('getUser');
    loginAs(true);
    cy.get('span.link').contains('Account').click();
    cy.url().should('include', '/me');
    cy.wait('@getUser');
    cy.get('p').should('contain', 'Admin');
    cy.get('p').should('contain', 'yoga@studio.com');
    cy.get('p').should('contain', 'You are admin');
    cy.get('button[color=warn]').should('not.exist');
  });

  it('Regular user profile displays correct information', () => {
    cy.intercept('GET', '/api/user/2', mockRegularUser).as('getUser');
    loginAs(false);
    cy.get('span.link').contains('Account').click();
    cy.url().should('include', '/me');
    cy.wait('@getUser');
    cy.get('p').should('contain', 'Regular');
    cy.get('p').should('contain', 'user@test.com');
    cy.get('p').contains('You are admin').should('not.exist');
    cy.get('button[color=warn]').should('be.visible');
  });

  it('Regular user can delete their account', () => {
    cy.intercept('GET', '/api/user/2', mockRegularUser).as('getUser');
    cy.intercept('DELETE', '/api/user/2', { statusCode: 200 }).as('deleteUser');
    loginAs(false);
    cy.get('span.link').contains('Account').click();
    cy.url().should('include', '/me');
    cy.wait('@getUser');
    cy.get('button[color=warn]').click();
    cy.wait('@deleteUser');
    cy.url().should('not.include', '/me');
    cy.get('span.link').contains('Login').should('be.visible');
  });

  it('Back button navigates to previous page', () => {
    cy.intercept('GET', '/api/user/1', mockAdminUser).as('getUser');
    loginAs(true);
    cy.get('span.link').contains('Account').click();
    cy.url().should('include', '/me');
    cy.wait('@getUser');
    cy.get('button[mat-icon-button]').click();
    cy.url().should('include', '/sessions');
  });

  it('Logout from navbar works', () => {
    loginAs(false);
    cy.get('span.link').contains('Logout').click();
    cy.url().should('not.include', '/sessions');
    cy.get('span.link').contains('Login').should('be.visible');
  });
});
