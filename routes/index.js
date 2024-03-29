var express = require('express');
var router = express.Router();

var quizController = require('../controllers/quiz_controller.js');
var creditsController = require('../controllers/credits_controller.js');
var commentController = require('../controllers/comment_controller.js');
var sessionController = require('../controllers/session_controller.js');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Quiz' });
});

// Instalar autoload si el parametro esta presente
router.param('quizId', quizController.load );
router.param('commentId', commentController.load );

// Rutas de session:
router.get('/login', sessionController.new );
router.post('/login', sessionController.create );
router.get('/logout', sessionController.destroy );

/* Quizes: question, answer, new, post new, update, delete ...  */
router.get('/quizes/:quizId(\\d+)', quizController.show );
router.get('/quizes/:quizId(\\d+)/answer', quizController.answer );
router.get('/quizes/new', sessionController.loginRequired, quizController.new );
router.post('/quizes/create', sessionController.loginRequired, quizController.create );
router.get('/quizes/:quizId(\\d+)/edit', sessionController.loginRequired, quizController.edit );
router.put('/quizes/:quizId(\\d+)', sessionController.loginRequired, quizController.update );
router.delete('/quizes/:quizId(\\d+)', sessionController.loginRequired, quizController.destroy );
router.get('/quizes', quizController.index );

/* Author */
router.get('/author', creditsController.author );

/* Comments */
router.get('/quizes/:quizId(\\d+)/comments/new', commentController.new );
router.post('/quizes/:quizId(\\d+)/comments', commentController.create );
router.get('/quizes/:quizId(\\d+)/comments/:commentId(\\d+)/publish', 
                                              sessionController.loginRequired, 
                                              commentController.publish );

module.exports = router;
