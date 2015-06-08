
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
      models.Quiz.findAll( {order: 'pregunta ASC'} ).then( function( quizes ) {
        res.render('quizes/index.ejs', { quizes: quizes } );
      });
  }
  // hay parametro de busqueda, hacer la con findAll():
  else {
      cadena_busqueda = "%" + search.replace(" ", "%") + "%";
      models.Quiz.findAll( {where: ["pregunta like ?", cadena_busqueda],
                            order: 'pregunta ASC' } ).
         then( function( quizes ) {
            res.render('quizes/index.ejs', { quizes: quizes } );
      });
  }
}

// GET /quizes/new
exports.new = function( req, res ) {
    var quiz = models.Quiz.build(
            { pregunta: "", respuesta: "", 
              texto_respuesta: "", genero: "" }
        );
    res.render('quizes/new', { quiz: quiz } );
}


// POST /quizes/create
exports.create = function( req, res ) {

    var pregunta = req.body.quiz.pregunta;
    var respuesta = req.body.quiz.respuesta;
    var texto_respuesta = req.body.quiz.texto_respuesta;
    var genero = req.body.quiz.genero;

    if( typeof pregunta === "undefined" || 
        typeof respuesta === "undefined" || 
        typeof texto_respuesta === "undefined" ||
        typeof genero === "undefined" )
    {
      res.redirect("/quizes");
    }

    // req.body.quiz ha sido construido por bodyparser al usar
    // notacion pseudoJSON en los nombres de los campos (ver vista)
    var quiz = models.Quiz.build( req.body.quiz );


    /*
    // Sin validacion:
    quiz.save( {fields: ["pregunta", "respuesta", 
                         "texto_respuesta", "genero" ]} )
    .then( function() {
            res.redirect("/quizes");
          }
    );
    */

    // Con validacion (requiere sequelize 2.0.0 o superior!).
    quiz
      .validate()
      .then(
          function( err ) {
            if( err ) {
              res.render('quizes/new', {quiz: quiz, errors: err.errors });
            } 
            else {

              // Envolver respuesta entre ^ y $
              if( quiz.respuesta.charAt(0) != "^" ) {
                  quiz.respuesta = "^" + quiz.respuesta;
              }
              if( quiz.respuesta.charAt(quiz.respuesta.length-1) != "$" ) {
                  quiz.respuesta = quiz.respuesta + "$";
              }

              quiz.save( {fields: ["pregunta", "respuesta", 
                                   "texto_respuesta", "genero"]} )
              .then( function() { res.redirect("/quizes"); });
            } // else
         } // function err
        ); // then
}


// GET /quizes/id/edit
exports.edit = function( req, res ) {
    res.render('quizes/edit', { quiz: req.quiz } );
}


exports.update = function( req, res ) {
    req.quiz.pregunta = req.body.quiz.pregunta;
    req.quiz.respuesta = req.body.quiz.respuesta;
    req.quiz.texto_respuesta = req.body.quiz.texto_respuesta;
    req.quiz.genero = req.body.quiz.genero;

    /*
    // Sin validacion
    req.quiz.save( {fields: ["pregunta", "respuesta", 
                             "texto_respuesta", "genero"]} )
    .then( function() {
            res.redirect("/quizes");
          }
    );
    */

    // Con validacion (requiere sequelize 2.0.0 o superior!).
    req.quiz
      .validate()
      .then(
          function( err ) {
            if( err ) {
              res.render('quizes/edit', {quiz: req.quiz, errors: err.errors });
            } 
            else {

              req.quiz.save( {fields: ["pregunta", "respuesta", 
                                   "texto_respuesta", "genero"]} )
              .then( function() { res.redirect("/quizes"); });
            } // else
         } // function err
        ); // then
}

// POST /quizes/create
exports.destroy = function( req, res ) {

  req.quiz.destroy().then( 
      function() {
        res.redirect("/quizes");
      } // end function
      ).catch( function(error) { next(error); } );

}

