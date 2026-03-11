export {};

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

const loginAs = (admin: boolean) => {
  const user = admin ? mockAdminUser : mockRegularUser
  cy.visit('/login')
  cy.intercept('POST', '/api/auth/login', {
    body: {
      id: user.id,
      username: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      admin: user.admin
    }
  })
  cy.intercept('GET', '/api/session', []).as('sessions')
  cy.get('input[formControlName=email]').type(user.email)
  cy.get('input[formControlName=password]').type('test!1234')
  cy.get('button[type=submit]').click()
  cy.url().should('include', '/sessions')
}

describe('Me (profile) spec', () => {
  it('Admin can navigate to profile page', () => {
    cy.intercept('GET', '/api/user/1', mockAdminUser).as('getUser')
    loginAs(true)

    cy.get('span.link').contains('Account').click()
    cy.url().should('include', '/me')
    cy.wait('@getUser')
  })

  it('Admin profile displays correct information', () => {
    cy.intercept('GET', '/api/user/1', mockAdminUser).as('getUser')
    loginAs(true)

    cy.get('span.link').contains('Account').click()
    cy.url().should('include', '/me')
    cy.wait('@getUser')

    cy.get('p').should('contain', 'Admin')
    cy.get('p').should('contain', 'USER')
    cy.get('p').should('contain', 'yoga@studio.com')
    cy.get('p').should('contain', 'You are admin')
    cy.get('button[color=warn]').should('not.exist')
  })

  it('Regular user profile displays correct information', () => {
    cy.intercept('GET', '/api/user/2', mockRegularUser).as('getUser')
    loginAs(false)

    cy.get('span.link').contains('Account').click()
    cy.url().should('include', '/me')
    cy.wait('@getUser')

    cy.get('p').should('contain', 'Regular')
    cy.get('p').should('contain', 'USER')
    cy.get('p').should('contain', 'user@test.com')
    cy.get('p').contains('You are admin').should('not.exist')
    cy.get('button[color=warn]').should('be.visible')
  })

  it('Regular user can delete their account', () => {
    cy.intercept('GET', '/api/user/2', mockRegularUser).as('getUser')
    cy.intercept('DELETE', '/api/user/2', { statusCode: 200 }).as('deleteUser')
    loginAs(false)

    cy.get('span.link').contains('Account').click()
    cy.url().should('include', '/me')
    cy.wait('@getUser')

    cy.get('button[color=warn]').click()

    cy.wait('@deleteUser')
    cy.url().should('not.include', '/me')
    cy.get('span.link').contains('Login').should('be.visible')
  })

  it('Back button navigates to previous page', () => {
    cy.intercept('GET', '/api/user/1', mockAdminUser).as('getUser')
    loginAs(true)

    cy.get('span.link').contains('Account').click()
    cy.url().should('include', '/me')
    cy.wait('@getUser')

    cy.get('button[mat-icon-button]').click()
    cy.url().should('include', '/sessions')
  })

  it('Logout from navbar works', () => {
    loginAs(false)

    cy.get('span.link').contains('Logout').click()
    cy.url().should('not.include', '/sessions')
    cy.get('span.link').contains('Login').should('be.visible')
    cy.get('span.link').contains('Register').should('be.visible')
  })
});
