
var models = require('../models/models.js');

// GET /quizes/question
exports.show = function( req, res ) {
  models.Quiz.find(req.params.quizId).then( function(quiz) {
    res.render('quizes/show', { quiz: quiz } );
  });
}

// GET /quizes/answer
exports.answer = function( req, res ) {

  models.Quiz.find(req.params.quizId).then( function(quiz) {

    var respuesta = req.query.respuesta;
    var re = new RegExp( quiz.respuesta, 'i');
    if( respuesta.match( re ) != null ) {
      res.render('quizes/answer', { quiz: quiz,
                                    respuesta: 'Correcto' });
    }
    else {
      res.render('quizes/answer', { quiz: quiz,
                                    respuesta: 'Incorrecto' });
    }
  });

}

exports.index = function( req, res ) {
  models.Quiz.findAll().then( function( quizes ) {
    res.render('quizes/index.ejs', { quizes: quizes } );
  });
}
