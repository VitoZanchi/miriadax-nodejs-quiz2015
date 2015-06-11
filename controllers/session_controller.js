

// GET /login
exports.new = function( req, res ) {
    var errors = req.session.errors || [] ;
    req.session.errors = {};

    res.render('sessions/new', { errors: errors } );
}

// POST /login
exports.create = function( req, res ) {

    var login = req.body.login;
    var password = req.body.password;

    var userController = require('./user_controller.js');
    userController.autenticar( login, password, function( error, user ) {

      if( error ) {
        req.session.errors = [ {"message": 'Se ha producido un error: ' + error} ];
        res.redirect("/login");
        return;
      }

      // login OK, crear variable de sesion y redirigir al user donde iba
      req.session.user = { id: user.id, username: user.username };
      if( typeof req.session.redir !== "undefined" ) {
        res.redirect(req.session.redir.toString());
      }
      else {
        res.redirect("/");
      }
    });
}


// GET /logout
exports.destroy = function( req, res ) {

  delete req.session.user;
  if( typeof req.session.redir !== "undefined" ) {
    res.redirect(req.session.redir.toString());
  }
  else {
    res.redirect("/");
  }
}

