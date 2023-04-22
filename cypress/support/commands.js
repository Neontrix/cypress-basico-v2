Cypress.Commands.add('fillMandatoryFieldsAndSubmit', function(){
    cy.get('#firstName').type('Victor')
    cy.get('#lastName').type('Carvalho')
    cy.get('#email').type('vitor.sos.2010@gmail.com')
    cy.get('#open-text-area').type('test')
    //cy.get('button[type="submit"]').click()
    cy.contains('button', 'Enviar').click()
})

