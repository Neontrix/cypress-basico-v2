/// <reference types="Cypress" />

describe('Central de Atendimento ao Cliente TAT', function() {
  const Three_Seconds_In_Ms = 3000
  this.beforeEach(function(){
    cy.visit('./src/index.html')
  })

// Comando para rodar 3 vezes o mesmo teste
  Cypress._.times(3, function() {
    it('verifica o título da aplicação', function() {
      cy.title().should('be.equal', 'Central de Atendimento ao Cliente TAT')
    })
  })

  it('preenche os campos obrigatórios e envia o formulário', function(){
    const longText = 'Test, Test, Test, Test, Test, Test, Test, Test, Test, Test, Test, Test, Test, Test, Test, Test, Test, Test, Test, Test, Test, Test, Test, Test, Test, Test, Test, Test'
    cy.get('#firstName').type('Victor')
    cy.get('#lastName').type('Carvalho')
    cy.get('#email').type('vitor.sos.2010@gmail.com')
    cy.get('#open-text-area').type(longText, {delay:0})
    //cy.get('button[type="submit"]').click()
    // Pausar o tempo
    cy.clock()
    cy.contains('button', 'Enviar').click()
    cy.get('.success').should('be.visible') 
    // Avançar 3 segundos do relógio 
    cy.tick(Three_Seconds_In_Ms) 
    cy.get('.success').should('not.be.visible')
  })

  it('exibe mensagem de erro ao submeter o formulário com um email com formatação inválida', function(){
    cy.get('#firstName').type('Victor')
    cy.get('#lastName').type('Carvalho')
    cy.get('#email').type('vitor.sos.2010@gmail,com')
    cy.get('#open-text-area').type('test')
    cy.clock()
    cy.contains('button', 'Enviar').click()
    cy.get('.error').should('be.visible')
    cy.tick(Three_Seconds_In_Ms)
    cy.get('.error').should('not.be.visible')
  })

  it('se um valor não-numérico for digitado no campo telefone, seu valor continuará vazio.', function(){
    cy.get('#phone').type('test').should('have.value', '')
  })

  it('exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário', function(){
    cy.get('#firstName').type('Victor')
    cy.get('#lastName').type('Carvalho')
    cy.get('#email').type('vitor.sos.2010@gmail.com')
    cy.get('#phone-checkbox').check()
    cy.get('#open-text-area').type('test')
    cy.clock()
    cy.contains('button', 'Enviar').click()
    cy.get('.error').should('be.visible')
    cy.tick(Three_Seconds_In_Ms)
    cy.get('.error').should('not.be.visible')
  })

  it('preenche e limpa os campos nome, sobrenome, email e telefone', function(){
    cy.get('#firstName').type('Teste').should('have.value', 'Teste').clear().should('have.value', '')
    cy.get('#lastName').type('Teste2').should('have.value', 'Teste2').clear().should('have.value', '')
    cy.get('#email').type('vitor.sos.2010@gmail.com').should('have.value', 'vitor.sos.2010@gmail.com').clear().should('have.value', '')
    cy.get('#phone').type('123456789').should('have.value', '123456789').clear().should('have.value', '')
  })

  it('exibe mensagem de erro ao submeter o formulário sem preencher os campos obrigatórios', function(){
    cy.clock()
    cy.contains('button', 'Enviar').click()
    cy.get('.error').should('be.visible')
    cy.tick(Three_Seconds_In_Ms)
    cy.get('.error').should('not.be.visible')
  })

  it('envia o formulário com sucesso usando um comando customizado', function(){
    cy.clock()
    cy.fillMandatoryFieldsAndSubmit()
    cy.get('.success').should('be.visible')
    cy.tick(Three_Seconds_In_Ms)
    cy.get('.success').should('not.be.visible')
  })

  it('seleciona um produto (YouTube) por seu texto', function(){
    cy.get('#product')
      .select('YouTube')
        .should('have.value', 'youtube')
  })

  it('seleciona um produto (Mentoria) por seu valor (value)', function(){
    cy.get('#product').select('mentoria').should('have.value', 'mentoria')
  })

  it('seleciona um produto (Blog) por seu índice', function(){
    cy.get('#product').select(1).should('have.value', 'blog')
  })

  it('marca o tipo de atendimento "Feedback"', function(){
    cy.get('input[type="radio"][value="feedback"]').check().should('have.value', 'feedback')
  })

  it('marca cada tipo de atendimento', function(){
    cy.get('input[type="radio"]').should('have.length', 3).each(function($radio){
      cy.wrap($radio).check()
      cy.wrap($radio).should('be.checked')
    })
  })

  it('marca ambos checkboxes, depois desmarca o último', function(){
    cy.get('input[type="checkbox"]').check().should('be.checked')
    .last().uncheck().should('not.be.checked')
  })

  it('seleciona um arquivo da pasta fixtures', function(){
    cy.get('input[type="file"]#file-upload')
      .should('not.have.value')
      .selectFile('./cypress/fixtures/example.json')
      .should(function(input){
        expect(input[0].files[0].name).to.eq('example.json')
      })
  })

  it('seleciona um arquivo simulando um drag-and-drop', function(){
    cy.get('input[type="file"]#file-upload')
      .should('not.have.value')
      .selectFile('./cypress/fixtures/example.json', {
        action: 'drag-drop'
      })
      .should(function(input){
        expect(input[0].files[0].name).to.eq('example.json')
      })
  })

  it('seleciona um arquivo utilizando uma fixture para a qual foi dada um alias', function(){
    cy.fixture('example.json').as('exampleFile')
    cy.get('input[type="file"]#file-upload')
      .should('not.have.value')
      .selectFile('@exampleFile')
      .should(function(input){
        expect(input[0].files[0].name).to.eq('example.json')
      })
  })

  it('verifica que a política de privacidade abre em outra aba sem a necessidade de um clique', function(){
    cy.get('a')
      .should('have.attr', 'target', '_blank')
  })

  it('acessa a página da política de privacidade removendo o target e então clicanco no link', function(){
    cy.get('a').invoke('removeAttr', 'target')
      .click()
  })

  it('exibe e esconde as mensagens de sucesso e erro usando o .invoke', () =>{
    cy.get('.success')
      .should('not.be.visible')
      .invoke('show')
      .should('be.visible')
      .and('contain', 'Mensagem enviada com sucesso.')
      .invoke('hide')
      .should('not.be.visible')
    cy.get('.error')
      .should('not.be.visible')
      .invoke('show')
      .should('be.visible')
      .and('contain', 'Valide os campos obrigatórios!')
      .invoke('hide')
      .should('not.be.visible')
  })

  it('preenche a area de texto usando o comando invoke', () =>{
    const textao = Cypress._.repeat('teste ', 3)
    cy.get('#open-text-area')
      .invoke('val', textao)
      .should('have.value', textao)
  })

  it('faz uma requisição HTTP' , function(){
    cy.request('GET', 'https://cac-tat.s3.eu-central-1.amazonaws.com/index.html').as('telaInicial')
      cy.get('@telaInicial').should(function(response) {
        const {status, statusText, body} = response
        expect(response.status).to.eq(200)
        expect(response.statusText).to.eq('OK')
        expect(body).to.include('CAC TAT')
      })
  })

  it('encontre o gato', function(){
    cy.get('#cat')
      .should('not.be.visible')
      .invoke('show')
      .should('be.visible')
    cy.get('#title')
      .invoke('text', 'CAT TAT')
  })

})