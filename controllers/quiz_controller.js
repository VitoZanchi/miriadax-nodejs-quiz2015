
var models = require('../models/models.js');

// GET /quizes/question
exports.question = function( req, res ) {
  models.Quiz.findAll().success( function(quiz) {
    res.render('quizes/question', { pregunta: quiz[0].pregunta } );
  });
}

// GET /quizes/answer
exports.answer = function( req, res ) {

  models.Quiz.findAll().success( function(quiz) {

    var respuesta = req.query.respuesta;
    var re = new RegExp( quiz[0].respuesta, 'i');
    if( respuesta.match( re ) != null ) {
      res.render('quizes/answer', { respuesta: 'Correcto', 
                                    texto_respuesta: "" } );
    }
    else {
      res.render('quizes/answer', { respuesta: 'Incorrecto',
                                    texto_respuesta: quiz[0].texto_respuesta } );
    }
  });

}
