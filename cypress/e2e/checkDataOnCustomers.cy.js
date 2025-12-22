describe('Check data on customers', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173');
  })

  it('can login, select first car option, select all customers and see table, press anonymize and remove anonymization', () => {
    //login
    cy.get('input[type="email"]').type('signe@mail.com');
    cy.get('input[type="password"]').type('213');
    cy.contains('button', 'Login').click();

    //go to administration
    cy.contains('div', 'Administration').should('be.visible').click();

    //go to sales page
    cy.contains('button', 'Kundedata').click();

    //choose 0-25 cars in dropdown
    cy.get('.dropdown').contains('Antal biler').click();
    cy.get('.dropdown-options').should('be.visible');
    cy.get('.dropdown-options .dropdown-item').eq(1).click();

    //choose all
    cy.contains('button', 'Vælg alle').click();

    //show chosen customers
    cy.contains('button', 'Vis valgte').click();

    //anonymize
    cy.contains('button', 'Anonymiser').click();

    //show data
    cy.contains('button', 'Vis data').click();

    //remove anonymization
    cy.contains('button', 'Ja').click();
  });
});