export {};

const mockTeachers = [
  {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 2,
    firstName: 'Jane',
    lastName: 'Smith',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const mockSession = {
  id: 1,
  name: 'Morning Yoga',
  description: 'A relaxing morning yoga session',
  date: '2024-06-15',
  teacher_id: 1,
  users: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

const loginAsAdmin = () => {
  cy.visit('/login')
  cy.intercept('POST', '/api/auth/login', {
    body: {
      id: 1,
      username: 'yoga@studio.com',
      firstName: 'Admin',
      lastName: 'User',
      admin: true
    }
  })
  cy.intercept('GET', '/api/session', [mockSession]).as('sessions')
  cy.intercept('GET', '/api/teacher', mockTeachers).as('teachers')
  cy.get('input[formControlName=email]').type('yoga@studio.com')
  cy.get('input[formControlName=password]').type('test!1234')
  cy.get('button[type=submit]').click()
  cy.url().should('include', '/sessions')
}

describe('Session form spec', () => {
  it('Admin can navigate to create session form', () => {
    loginAsAdmin()

    cy.contains('button', 'Create').click()
    cy.url().should('include', '/sessions/create')
    cy.get('h1').should('contain', 'Create session')
  })

  it('Create form has all required fields', () => {
    loginAsAdmin()

    cy.contains('button', 'Create').click()
    cy.url().should('include', '/sessions/create')

    cy.get('input[formControlName=name]').should('be.visible')
    cy.get('input[formControlName=date]').should('be.visible')
    cy.get('mat-select[formControlName=teacher_id]').should('be.visible')
    cy.get('textarea[formControlName=description]').should('be.visible')
    cy.get('button[type=submit]').should('be.disabled')
  })

  it('Admin can create a session', () => {
    loginAsAdmin()
    cy.intercept('POST', '/api/session', { statusCode: 200, body: mockSession }).as('createSession')
    cy.intercept('GET', '/api/session', [mockSession]).as('sessionsUpdated')

    cy.contains('button', 'Create').click()
    cy.url().should('include', '/sessions/create')

    cy.get('input[formControlName=name]').type('New Yoga Session')
    cy.get('input[formControlName=date]').type('2024-07-01')
    cy.get('mat-select[formControlName=teacher_id]').click()
    cy.get('mat-option').first().click()
    cy.get('textarea[formControlName=description]').type('A great yoga session')

    cy.get('button[type=submit]').should('not.be.disabled')
    cy.get('button[type=submit]').click()

    cy.wait('@createSession')
    cy.url().should('include', '/sessions')
  })

  it('Admin can navigate to update session form', () => {
    cy.intercept('GET', '/api/session/1', mockSession).as('sessionDetail')
    cy.intercept('GET', '/api/teacher', mockTeachers).as('teachers')
    loginAsAdmin()

    cy.contains('button', 'Edit').first().click()
    cy.url().should('include', '/sessions/update/1')
    cy.get('h1').should('contain', 'Update session')
  })

  it('Update form is pre-filled with session data', () => {
    cy.intercept('GET', '/api/session/1', mockSession).as('sessionDetail')
    cy.intercept('GET', '/api/teacher', mockTeachers).as('teachers')
    loginAsAdmin()

    cy.contains('button', 'Edit').first().click()
    cy.wait('@sessionDetail')

    cy.get('input[formControlName=name]').should('have.value', 'Morning Yoga')
    cy.get('textarea[formControlName=description]').should('have.value', 'A relaxing morning yoga session')
  })

  it('Admin can update a session', () => {
    cy.intercept('GET', '/api/session/1', mockSession).as('sessionDetail')
    cy.intercept('GET', '/api/teacher', mockTeachers).as('teachers')
    cy.intercept('PUT', '/api/session/1', { statusCode: 200, body: { ...mockSession, name: 'Updated Yoga' } }).as('updateSession')
    cy.intercept('GET', '/api/session', [mockSession]).as('sessionsUpdated')
    loginAsAdmin()

    cy.contains('button', 'Edit').first().click()
    cy.wait('@sessionDetail')

    cy.get('input[formControlName=name]').clear().type('Updated Yoga')
    cy.get('button[type=submit]').click()

    cy.wait('@updateSession')
    cy.url().should('include', '/sessions')
  })
});
