export {};

describe('Register spec', () => {
  it('Register successfull', () => {
    cy.visit('/register')

    cy.intercept('POST', '/api/auth/register', {
      statusCode: 200,
      body: {}
    })

    cy.get('input[formControlName=firstName]').type('John')
    cy.get('input[formControlName=lastName]').type('Doe')
    cy.get('input[formControlName=email]').type('john.doe@test.com')
    cy.get('input[formControlName=password]').type('test!1234')

    cy.get('button[type=submit]').click()

    cy.url().should('include', '/login')
  })

  it('Register failed', () => {
    cy.visit('/register')

    cy.intercept('POST', '/api/auth/register', {
      statusCode: 400,
      body: { message: 'Email already exists' }
    })

    cy.get('input[formControlName=firstName]').type('John')
    cy.get('input[formControlName=lastName]').type('Doe')
    cy.get('input[formControlName=email]').type('existing@test.com')
    cy.get('input[formControlName=password]').type('test!1234')

    cy.get('button[type=submit]').click()

    cy.get('.error').should('be.visible').and('contain', 'An error occurred')
    cy.url().should('include', '/register')
  })

  it('Submit button disabled when form is invalid', () => {
    cy.visit('/register')

    cy.get('button[type=submit]').should('be.disabled')

    cy.get('input[formControlName=firstName]').type('John')
    cy.get('button[type=submit]').should('be.disabled')

    cy.get('input[formControlName=lastName]').type('Doe')
    cy.get('input[formControlName=email]').type('john.doe@test.com')
    cy.get('input[formControlName=password]').type('test!1234')

    cy.get('button[type=submit]').should('not.be.disabled')
  })
});
