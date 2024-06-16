/// <reference types="cypress" />

describe('Mi primer test', () => {
    it('Visita la página principal', () => {
      cy.visit('http://localhost:5173') // reemplaza con la URL de tu aplicación
  
      // Asegúrate de que el título de la página sea correcto
      cy.title().should('include', 'Nombre de tu aplicación')
  
      // Asegúrate de que un elemento con el texto "Hello World" exista
      cy.contains('Hello World').should('exist')
    })
  })