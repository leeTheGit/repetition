
describe('Repetition auth journey', () => {
  
    // var email = `test+${Math.floor(Math.random() * 100000)}@email.io`;
    var email = `test@test.com`;
    var loginUrl = Cypress.env('loginUrl');

    beforeEach(() => {
      cy.visit(`/${loginUrl}`)
    })



    it('Error with incorrect password format', () => {
        Cypress.log({
          name: 'signin',
          message: `${email}`,
        });

        cy.getBySel('email')
          .should('be.visible')
          .type('email@test.com').trigger('change')
          .should('have.value', 'email@test.com')

        cy.getBySel('password').should('be.visible')
          .type('11').trigger('change')
          .should('have.value', '11')

        cy.getBySel('login_button').click()

        cy.getBySel('form_error')
          .should('be.visible')
          .should('include.text', 'Password must be between 6 and 255 characters');
    })

    it('Error with incorrect password format', () => {
        Cypress.log({
          name: 'signin',
          message: `${email}`,
        });

        cy.getBySel('email').should('be.visible');
        cy.getBySel('email').type(email).trigger('change').should('have.value', email);
        cy.getBySel('password').should('be.visible');
        cy.getBySel('password').type('222222').trigger('change').should('have.value', '222222');
        cy.getBySel('login_button').click();
        cy.getBySel('form_error').should('be.visible');
        cy.getBySel('form_error').should('include.text', 'Incorrect username or password');


    })

    it('Successfully logs in', () => {
        Cypress.log({
          name: 'signin',
          message: `${email}`,
        });

      cy.session( email, () => {
        cy.visit(`/${loginUrl}`)

        cy.getBySel('email')
          .should('be.visible')
          .type('test@test.com').trigger('change')
          .should('have.value', 'test@test.com')

        cy.getBySel('password').should('be.visible')
          .type('111111').trigger('change')
          .should('have.value', '111111')

        cy.getBySel('login_button').click()

        cy.location("pathname").should("equal", "/dashboard")
      });

    })
})



