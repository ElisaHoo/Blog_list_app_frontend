/* eslint-disable no-undef */
describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`)  // resets db before tests
    const user = {
      name: 'Administrator',
      username: 'admin',
      password: 'topsecret'
    }
    const secondUser = {
      name: 'Test User',
      username: 'tester',
      password: 'qwerty'
    }
    cy.request('POST', `${Cypress.env('BACKEND')}/users`, secondUser)
    cy.request('POST', `${Cypress.env('BACKEND')}/users`, user)
    cy.visit('')  // Visits Cypress.e2e baseUrl ('http://localhost:3000)
  })
  
  it('Login form is shown', function() {
    cy.contains('Blog List Application')
    cy.contains('Log in')
  })

  describe('Login', function() {
    it('succeeds with correct credentials', function() {
      cy.contains('Log in').click()
      cy.get('#username').type('admin')
      cy.get('#password').type('topsecret')
      cy.get('#login-button').click()

      cy.contains('Administrator logged in')
    })
    
    it('fails with wrong credenttials', function() {
      cy.contains('Log in').click()
      cy.get('#username').type('admin')
      cy.get('#password').type('wrongpassword')
      cy.get('#login-button').click()

      cy.get('.error').should('contain', 'Wrong username or password')
      cy.get('.error').should('have.css', 'color', 'rgb(255, 0, 0)')
      cy.get('.error').should('have.css', 'border-style', 'solid')
    })
  })

  describe('When logged in and a new blog has been created', function() {
    beforeEach(function() {
      cy.contains('Log in').click()
      cy.get('#username').type('admin')
      cy.get('#password').type('topsecret')
      cy.get('#login-button').click()

      cy.contains('Add a new blog').click()

      cy.get('#title').type('Test Blog')
      cy.get('#author').type('Test Author')
      cy.get('#url').type('http://www.test.fi')
      cy.get('#add-button').click()
    })

    it('a blog can be found in the list', function() {
      cy.contains('Test Blog, Test Author')
      cy.contains('View')
    })

    it('a blog can be liked', function() {
      cy.get('#view-button').click()
      cy.get('#like-button').click()
      cy.contains('Likes 1')
    })

    it('a blog can be deleted by a user who created it', function() {
      cy.get('#view-button').click()
      cy.get('#delete-button').click()
      cy.get('html').should('not.contain', 'Test Blog, Test Author')
    })

    it('a user who has not added the blog can not see the delete button', function() {
      cy.contains('Logout').click()

      cy.contains('Log in').click()
      cy.get('#username').type('tester')
      cy.get('#password').type('qwerty')
      cy.get('#login-button').click()

      cy.get('#view-button').click()
      cy.get('html').should('not.contain', 'Delete')
    })
  })

  describe('When creating several blogs', function() {
    beforeEach(function() {
      cy.contains('Log in').click()
      cy.get('#username').type('admin')
      cy.get('#password').type('topsecret')
      cy.get('#login-button').click()

      cy.contains('Add a new blog').click()
      cy.get('#title').type('Blog 1')
      cy.get('#author').type('Test Author 1')
      cy.get('#url').type('http://www.test1.fi')
      cy.get('#add-button').click()

      cy.contains('Add a new blog').click()
      cy.get('#title').type('Blog 2')
      cy.get('#author').type('Test Author 2')
      cy.get('#url').type('http://www.test2.fi')
      cy.get('#add-button').click()

      cy.contains('Add a new blog').click()
      cy.get('#title').type('Blog 3')
      cy.get('#author').type('Test Author 3')
      cy.get('#url').type('http://www.test3.fi')
      cy.get('#add-button').click()

      cy.contains('Blog 1, Test Author 1').parent().find('#view-button').click()
      cy.contains('Likes').find('#like-button').click().click()

      cy.contains('Blog 2, Test Author 2').parent().find('#view-button').click()      
      cy.contains('Blog 2, author Test Author 2').parent().find('#like-button').click()

      cy.contains('Blog 3, Test Author 3').parent().find('#view-button').click()
      cy.contains('Blog 3, author Test Author 3').parent().find('#like-button').click().click().click()
    })
    
    it('the blogs are displayed in order according to likes', function() {
      cy.get('.blog_all').eq(0).should('contain', 'Blog 3')
      cy.get('.blog_all').eq(1).should('contain', 'Blog 1')
      cy.get('.blog_all').eq(2).should('contain', 'Blog 2')
    })
  })
})