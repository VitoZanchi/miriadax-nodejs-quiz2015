
var models = require('../models/models.js');


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

