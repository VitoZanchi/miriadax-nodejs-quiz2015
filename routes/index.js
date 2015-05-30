var express = require('express');
var router = express.Router();

var quizController = require('../controllers/quiz_controller.js');
var creditsController = require('../controllers/credits_controller.js');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Quiz' });
});

/* Quiz: question */
router.get('/quizes/question', quizController.question );

/* Quiz: answer */
router.get('/quizes/answer', quizController.answer );

/* Quiz: answer */
router.get('/author', creditsController.author );

module.exports = router;
