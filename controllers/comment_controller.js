
var models = require('../models/models.js');



// Autoload: se usa si ruta incluye :quizId
exports.load = function( req, res, next, commentId ) {
  models.Comment.find(
                {
                  where: { id: Number(commentId) }
                }
              ).then (
    function( comment ) {
      if( comment ) {
        req.comment = comment;
        next();
      }
      else {
        next( new Error('No existe el comentario de ID ' + commentId ));
      }
    }
  ).catch( function(error) { next(error); });
}


// GET (new comment form)
exports.new= function( req, res ) {
    res.render('comments/new.ejs', {    comment: "",
                                        quizid: req.params.quizId, 
                                        errors: [] } );
}

// POST (new comment data)
exports.create = function( req, res ) {

    var comment = models.Comment.build( 
        { 
          texto: req.body.comment.texto,
          QuizId: req.params.quizId 
        } );

    // Con validacion (requiere sequelize 2.0.0 o superior!).
    comment 
      .validate()
      .then(
          function( err ) {
            if( err ) {
              res.render('comments/new', { comment: comment.texto, 
                                           quizid: req.params.quizId, 
                                           errors: err.errors });
            } 
            else {

              comment.save()
              .then( function() { res.redirect("/quizes/" + req.params.quizId); });
            } // else
         } // function err
        ).catch(function(error){ next(error) }); // then
}


exports.publish = function( req, res ) {

  req.comment.publicado = true;
  req.comment.save( { fields: ["publicado"] } )
    .then( function() { res.redirect("/quizes/" + req.params.quizId); } )
    .catch(function(error){ next(error) });
};
