
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

// GET /quizes/show
exports.show = function( req, res ) {
    res.render('quizes/show', { quiz: req.quiz } );
}

// GET /quizes/answer
exports.answer = function( req, res ) {

    var respuesta_valida_regexp = req.quiz.respuesta;
    var re = new RegExp( respuesta_valida_regexp, 'i');
    var resultado = "incorrecta.";
    var correcta = false;
    if( req.query.respuesta.match( re ) != null ) {
      resultado = "correcta.";
      correcta = true;
    }
    res.render('quizes/answer', { quiz: req.quiz,
                                  respuesta: "Respuesta " + resultado,
                                  correcta: correcta });
};

// GET /quizes
exports.index = function( req, res ) {

  search = req.query.search;

  // no hay parametro de busqueda: mostrar todas las preguntas:
  if( typeof search === "undefined" || !search ) {
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

// GET /quizes/new
exports.new = function( req, res ) {
    var quiz = models.Quiz.build(
            { pregunta: "", respuesta: "", texto_respuesta: "" }
        );
    res.render('quizes/new', { quiz: quiz } );
}


// POST /quizes/create
exports.create = function( req, res ) {

    var pregunta = req.body.pregunta;
    var respuesta = req.body.respuesta;
    var texto_respuesta = req.body.texto_respuesta;

    if( typeof pregunta === "undefined" || 
        typeof respuesta === "undefined" || 
        typeof texto_respuesta === "undefined" )
    {
      res.redirect("/quizes");
    }

    // req.body.quiz ha sido construido por bodyparser al usar
    // notacion pseudoJSON en los nombres de los campos (ver vista)
    var quiz = models.Quiz.build( req.body.quiz );

    // Envolver respuesta entre ^ y $
    if( quiz.respuesta.charAt(0) != "^" ) {
        quiz.respuesta = "^" + quiz.respuesta;
    }
    if( quiz.respuesta.charAt(quiz.respuesta.length-1) != "$" ) {
        quiz.respuesta = quiz.respuesta + "$";
    }
    quiz.save( {fields: ["pregunta", "respuesta", "texto_respuesta"]} )
      .then( function() {
          res.redirect("/quizes");
      })
}

