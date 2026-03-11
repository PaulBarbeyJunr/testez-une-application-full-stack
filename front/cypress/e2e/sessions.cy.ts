export {};

const mockSessions = [
  {
    id: 1,
    name: 'Morning Yoga',
    description: 'A relaxing morning yoga session',
    date: new Date('2024-06-15').toISOString(),
    teacher_id: 1,
    users: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
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
  cy.intercept('GET', '/api/session', mockSessions).as('sessions')
  cy.get('input[formControlName=email]').type('yoga@studio.com')
  cy.get('input[formControlName=password]').type('test!1234')
  cy.get('button[type=submit]').click()
  cy.url().should('include', '/sessions')
}

const loginAsUser = () => {
  cy.visit('/login')
  cy.intercept('POST', '/api/auth/login', {
    body: {
      id: 2,
      username: 'user@test.com',
      firstName: 'Regular',
      lastName: 'User',
      admin: false
    }
  })
  cy.intercept('GET', '/api/session', mockSessions).as('sessions')
  cy.get('input[formControlName=email]').type('user@test.com')
  cy.get('input[formControlName=password]').type('test!1234')
  cy.get('button[type=submit]').click()
  cy.url().should('include', '/sessions')
}

describe('Sessions list spec', () => {
  it('Admin sees sessions list with Create button', () => {
    loginAsAdmin()

    cy.get('mat-card-title').should('contain', 'Rentals available')
    cy.get('button').contains('Create').should('be.visible')
    cy.get('mat-card.item').should('have.length', 2)
    cy.get('mat-card.item').first().should('contain', 'Morning Yoga')
  })

  it('User sees sessions list without Create button', () => {
    loginAsUser()

    cy.get('mat-card-title').should('contain', 'Rentals available')
    cy.get('button').contains('Create').should('not.exist')
    cy.get('mat-card.item').should('have.length', 2)
  })

  it('Admin sees Edit button on sessions', () => {
    loginAsAdmin()

    cy.get('mat-card.item').first().within(() => {
      cy.get('button').contains('Edit').should('be.visible')
      cy.get('button').contains('Detail').should('be.visible')
    })
  })

  it('User does not see Edit button on sessions', () => {
    loginAsUser()

    cy.get('mat-card.item').first().within(() => {
      cy.get('button').contains('Edit').should('not.exist')
      cy.get('button').contains('Detail').should('be.visible')
    })
  })

  it('Logout redirects to home', () => {
    loginAsAdmin()

    cy.get('span.link').contains('Logout').click()
    cy.url().should('not.include', '/sessions')
    cy.get('span.link').contains('Login').should('be.visible')
    cy.get('span.link').contains('Register').should('be.visible')
  })
});
