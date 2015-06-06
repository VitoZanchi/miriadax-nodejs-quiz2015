
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
    if( req.query.respuesta.match( re ) != null ) {
      resultado = "Correcto";
    }
    res.render('quizes/answer', { quiz: req.quiz,
                                  respuesta: resultado });
};

// GET /quizes
exports.index = function( req, res ) {

  search = req.query.search;

  // no hay parametro de busqueda: mostrar todas las preguntas:
  if( typeof search === "undefined" ) {
      models.Quiz.findAll().then( function( quizes ) {
        res.render('quizes/index.ejs', { quizes: quizes } );
      });
  }
  // hay parametro de busqueda, hacer la con findAll():
  else {
      cadena_busqueda = "%" + search.replace(" ", "%") + "%";
      models.Quiz.findAll( {where: ["pregunta like ?", cadena_busqueda]} ).
         then( function( quizes ) {
            res.render('quizes/index.ejs', { quizes: quizes } );
      });
  }
}
