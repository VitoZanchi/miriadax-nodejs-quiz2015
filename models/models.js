var path = require("path");

var Sequelize = require("sequelize");

var sequelize = new Sequelize( null, null, null,
    { dialect: "sqlite", storage: "quiz.sqlite" } );

var Quiz = sequelize.import(path.join(__dirname,'quiz'));
exports.Quiz = Quiz;

// Creacion de tablas y carga inicial de datos en la BBDD:
sequelize.sync().success( function() {

  Quiz.count().success( function(count) {
    if( count == 0 ) {
      Quiz.create( 
        { pregunta: '¿Capital de Italia?',
          respuesta: '^Roma$',
          texto_respuesta: 'Roma'
        })
      .success( function() { console.log("BBDD inicializada."); });
    }
  });
});

