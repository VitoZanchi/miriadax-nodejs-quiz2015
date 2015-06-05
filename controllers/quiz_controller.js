
var models = require('../models/models.js');

// Autoload: se usa si ruta incluye :quizId

exports.load = function( req, res, next, quizId ) {
  models.Quiz.find(quizId).then (
    function( quiz ) {
      if( quiz ) {
        req.quiz = quiz;
        next();
      }
      else {
        next( new Error('No existe la pregunta ' + quizId ));
      }
    }
  ).catch( function(error) { next(error); });
}

// GET /quizes/question
exports.show = function( req, res ) {
    res.render('quizes/show', { quiz: req.quiz } );
}

// GET /quizes/answer
exports.answer = function( req, res ) {

    var respuesta_valida_regexp = req.quiz.respuesta;
    var re = new RegExp( respuesta_valida_regexp, 'i');
    var resultado = "Incorrecto";
    console.log( "******* respuesta **********" + req.query.respuesta );
    if( req.query.respuesta.match( re ) != null ) {
      resultado = "Correcto";
    }
    res.render('quizes/answer', { quiz: req.quiz,
                                  respuesta: resultado });
};


exports.index = function( req, res ) {
  models.Quiz.findAll().then( function( quizes ) {
    res.render('quizes/index.ejs', { quizes: quizes } );
  });
}
