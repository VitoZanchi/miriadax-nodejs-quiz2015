var express = require('express');
var router = express.Router();

var quizController = require('../controllers/quiz_controller.js');
var creditsController = require('../controllers/credits_controller.js');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Quiz' });
});

// Instalar autoload si el parametro esta presente
router.param('quizId', quizController.load );

/* Quiz: question */
router.get('/quizes/:quizId(\\d+)', quizController.show );

/* Quiz: answer */
router.get('/quizes/:quizId(\\d+)/answer', quizController.answer );

/* Quiz: new */
router.get('/quizes/new', quizController.new );

/* Quiz: post new */
router.post('/quizes/create', quizController.create );

/* Quiz: update */
router.get('/quizes/:quizId(\\d+)/edit', quizController.edit );
router.put('/quizes/:quizId(\\d+)', quizController.update );

/* Quiz: delete */
router.delete('/quizes/:quizId(\\d+)', quizController.destroy );

/* Quizes */
router.get('/quizes', quizController.index );

/* Author */
router.get('/author', creditsController.author );

module.exports = router;
