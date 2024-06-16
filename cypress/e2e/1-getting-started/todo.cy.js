/// <reference types="cypress" />

// ¡Bienvenido a Cypress!
//
// Este archivo de especificaciones contiene una variedad de pruebas de muestra
// para una aplicación de lista de tareas diseñadas para demostrar
// el poder de escribir pruebas en Cypress.
//
// Para aprender más sobre cómo funciona Cypress y
// lo que lo hace una herramienta de prueba tan impresionante,
// por favor lee nuestra guía de introducción:
// https://on.cypress.io/introduction-to-cypress

describe('ejemplo de la aplicación de lista de tareas', () => {
  beforeEach(() => {
    // Cypress comienza con un estado en blanco para cada prueba
    // por lo que debemos indicarle que visite nuestro sitio web con el comando `cy.visit()`.
    // Dado que queremos visitar la misma URL al inicio de todas nuestras pruebas,
    // lo incluimos en nuestra función beforeEach para que se ejecute antes de cada prueba.
    cy.visit('https://example.cypress.io/todo')
  })

  it('muestra dos elementos de tarea por defecto', () => {
    // Usamos el comando `cy.get()` para obtener todos los elementos que coinciden con el selector.
    // Luego, usamos `should` para afirmar que hay dos elementos coincidentes,
    // que son los dos elementos predeterminados.
    cy.get('.todo-list li').should('have.length', 2)

    // Podemos ir aún más lejos y comprobar que las tareas predeterminadas contienen
    // el texto correcto. Usamos las funciones `first` y `last`
    // para obtener individualmente el primer y último elementos coincidentes,
    // y luego realizamos una afirmación con `should`.
    cy.get('.todo-list li').first().should('have.text', 'Pagar la factura de luz')
    cy.get('.todo-list li').last().should('have.text', 'Pasear al perro')
  })

  it('puede agregar nuevas tareas', () => {
    // Almacenaremos el texto de nuestro nuevo elemento en una variable para poder reutilizarlo
    const newItem = 'Alimentar al gato'

    // Obtenemos el elemento de entrada y usamos el comando `type` para
    // introducir nuestro nuevo elemento de lista. Después de escribir el contenido de nuestro elemento,
    // también necesitamos escribir la tecla Enter para enviar la entrada.
    // Este input tiene un atributo data-test por lo que lo seleccionaremos de acuerdo con las mejores prácticas:
    // https://on.cypress.io/selecting-elements
    cy.get('[data-test=new-todo]').type(`${newItem}{enter}`)

    // Ahora que hemos escrito nuestro nuevo elemento, comprobemos que realmente se agregó a la lista.
    // Como es el elemento más nuevo, debería existir como el último elemento en la lista.
    // Además, con los dos elementos predeterminados, deberíamos tener un total de 3 elementos en la lista.
    // Dado que las aserciones devuelven el elemento en el que se realizó la afirmación,
    // podemos encadenar estas dos afirmaciones en una sola declaración.
    cy.get('.todo-list li')
      .should('have.length', 3)
      .last()
      .should('have.text', newItem)
  })

  it('puede marcar una tarea como completada', () => {
    // Además de usar el comando `get` para obtener un elemento por selector,
    // también podemos usar el comando `contains` para obtener un elemento por su contenido.
    // Sin embargo, esto devolverá el <label>, que es el elemento de nivel más bajo que contiene el texto.
    // Para marcar la tarea, encontraremos el elemento <input> para este <label>
    // recorriendo el DOM hasta el elemento padre. Desde allí, podemos `find`
    // el elemento <input> de la casilla de verificación y usar el comando `check` para marcarlo.
    cy.contains('Pagar la factura de luz')
      .parent()
      .find('input[type=checkbox]')
      .check()

    // Ahora que hemos marcado el botón, podemos asegurarnos de que
    // el elemento de la lista ahora está marcado como completado.
    // Nuevamente usaremos `contains` para encontrar el elemento <label> y luego usaremos el comando `parents`
    // para recorrer varios niveles hacia arriba en el DOM hasta que encontremos el elemento <li> correspondiente.
    // Una vez que obtengamos ese elemento, podemos afirmar que tiene la clase completado.
    cy.contains('Pagar la factura de luz')
      .parents('li')
      .should('have.class', 'completed')
  })

  context('con una tarea marcada', () => {
    beforeEach(() => {
      // Tomaremos el comando que usamos anteriormente para marcar un elemento
      // Dado que queremos realizar múltiples pruebas que comienzan con la verificación de un elemento,
      // lo colocamos en el hook beforeEach para que se ejecute al inicio de cada prueba.
      cy.contains('Pagar la factura de luz')
        .parent()
        .find('input[type=checkbox]')
        .check()
    })

    it('puede filtrar las tareas no completadas', () => {
      // Haremos clic en el botón "Active" para
      // mostrar solo los elementos incompletos.
      cy.contains('Activas').click()

      // Después de filtrar, podemos afirmar que hay solo una
      // tarea incompleta en la lista.
      cy.get('.todo-list li')
        .should('have.length', 1)
        .first()
        .should('have.text', 'Pasear al perro')

      // Por si acaso, también afirmemos que la tarea que marcamos
      // no existe en la página.
      cy.contains('Pagar la factura de luz').should('not.exist')
    })

    it('puede filtrar las tareas completadas', () => {
      // Podemos realizar pasos similares a la prueba anterior para asegurarnos
      // de que solo se muestran las tareas completadas.
      cy.contains('Completadas').click()

      cy.get('.todo-list li')
        .should('have.length', 1)
        .first()
        .should('have.text', 'Pagar la factura de luz')

      cy.contains('Pasear al perro').should('not.exist')
    })

    it('puede eliminar todas las tareas completadas', () => {
      // Primero, hagamos clic en el botón "Clear completed"
      // `contains` realmente sirve dos propósitos aquí.
      // Primero, asegura que el botón exista dentro del DOM.
      // Este botón solo aparece cuando al menos una tarea está marcada como completada,
      // por lo que este comando verifica implícitamente que existe.
      // Segundo, selecciona el botón para que podamos hacer clic en él.
      cy.contains('Limpiar completadas').click()

      // Luego nos aseguramos de que solo haya un elemento
      // en la lista y nuestro elemento no exista
      cy.get('.todo-list li')
        .should('have.length', 1)
        .should('not.have.text', 'Pagar la factura de luz')

      // Finalmente, asegurémonos de que el botón de limpiar completadas ya no exista.
      cy.contains('Limpiar completadas').should('not.exist')
    })
  })
})