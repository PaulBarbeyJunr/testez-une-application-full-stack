export {};

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

const mockSessionWithUser = {
  ...mockSession,
  users: [2]
};

const mockTeacher = {
  id: 1,
  firstName: 'John',
  lastName: 'Doe',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

const setupAndNavigateToDetail = (admin: boolean, sessionData = mockSession) => {
  cy.visit('/login')
  cy.intercept('POST', '/api/auth/login', {
    body: {
      id: admin ? 1 : 2,
      username: admin ? 'yoga@studio.com' : 'user@test.com',
      firstName: admin ? 'Admin' : 'Regular',
      lastName: 'User',
      admin
    }
  })
  cy.intercept('GET', '/api/session', [sessionData]).as('sessions')
  cy.intercept('GET', '/api/session/1', sessionData).as('sessionDetail')
  cy.intercept('GET', '/api/teacher/1', mockTeacher).as('teacher')

  cy.get('input[formControlName=email]').type(admin ? 'yoga@studio.com' : 'user@test.com')
  cy.get('input[formControlName=password]').type('test!1234')
  cy.get('button[type=submit]').click()
  cy.url().should('include', '/sessions')

  cy.contains('button', 'Detail').first().click()
  cy.url().should('include', '/sessions/detail/1')
}

describe('Session detail spec', () => {
  it('Admin sees session detail with Delete button', () => {
    setupAndNavigateToDetail(true)

    cy.get('h1').should('contain', 'Morning Yoga')
    cy.get('button').contains('Delete').should('be.visible')
    cy.get('button').contains('Participate').should('not.exist')
  })

  it('Admin can delete a session', () => {
    setupAndNavigateToDetail(true)

    cy.intercept('DELETE', '/api/session/1', { statusCode: 200 }).as('deleteSession')
    cy.intercept('GET', '/api/session', []).as('sessionsEmpty')

    cy.get('button').contains('Delete').click()

    cy.wait('@deleteSession')
    cy.url().should('include', '/sessions')
  })

  it('User sees Participate button when not participating', () => {
    setupAndNavigateToDetail(false)

    cy.get('h1').should('contain', 'Morning Yoga')
    cy.get('button').contains('Participate').should('be.visible')
    cy.get('button').contains('Delete').should('not.exist')
  })

  it('User can participate in a session', () => {
    setupAndNavigateToDetail(false)

    cy.intercept('POST', '/api/session/1/participate/2', { statusCode: 200 }).as('participate')
    cy.intercept('GET', '/api/session/1', mockSessionWithUser).as('sessionUpdated')

    cy.get('button').contains('Participate').click()

    cy.wait('@participate')
    cy.get('button').contains('Do not participate').should('be.visible')
  })

  it('User sees Do not participate button when already participating', () => {
    setupAndNavigateToDetail(false, mockSessionWithUser)

    cy.get('button').contains('Do not participate').should('be.visible')
    cy.get('button').contains('Participate').should('not.exist')
  })

  it('User can unparticipate from a session', () => {
    setupAndNavigateToDetail(false, mockSessionWithUser)

    cy.intercept('DELETE', '/api/session/1/participate/2', { statusCode: 200 }).as('unparticipate')
    cy.intercept('GET', '/api/session/1', mockSession).as('sessionUpdated')

    cy.get('button').contains('Do not participate').click()

    cy.wait('@unparticipate')
    cy.get('button').contains('Participate').should('be.visible')
  })

  it('Back button navigates to previous page', () => {
    setupAndNavigateToDetail(true)

    cy.get('button[mat-icon-button]').first().click()
    cy.url().should('include', '/sessions')
  })
});
