
// GET /quizes/question
exports.author = function( req, res ) {

  res.render('credits/author', 
               { autor: 'Santiago Romero',
                 foto: '/images/sromeroi.jpg',
                 twitter: '@sromeroi' } );

}
