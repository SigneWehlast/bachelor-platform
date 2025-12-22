describe('Compare leads on customers', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173')
  })

  it('can login, navigate, select customers in carboost and choose December', () => {
    //login
    cy.get('input[type="email"]').type('signe@mail.com');
    cy.get('input[type="password"]').type('213');
    cy.contains('button', 'Login').click();

    //go to administration
    cy.contains('div', 'Administration').should('be.visible').click();
    
    //go to lead-view / carboost
    cy.contains('button', 'Lead-view').click();

    //check off two customers
    cy.get('input[type="checkbox"]').eq(4).check();
    cy.get('input[type="checkbox"]').eq(7).check();

    //show chosen customers
    cy.contains('button', 'Vis valgte').click();

    //choose december
    cy.get('.dropdown').contains('Vælg periode').click();
    cy.get('.dropdown-options .dropdown-item').eq(1).click();

    //godkend
  })
})
