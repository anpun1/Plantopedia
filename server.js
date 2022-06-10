var express = require('express');
var fetch = require('node-fetch');
const fs = require('fs');
var app = express();
var exphbs = require('express-handlebars').create({ defaultLayout: 'main' });

app.engine('handlebars', exphbs.engine);
app.set('view engine', 'handlebars');
app.use(express.static('public'));
var bodyParser = require('body-parser');
var fileUpload = require('express-fileupload');
const { getMaxListeners } = require('process');
const res = require('express/lib/response');
app.set('port', process.env.PORT);
app.use(express.urlencoded({
  extended: true
}))

const { wakeDyno } = require('heroku-keep-awake');


const PORT = process.env.PORT || 3000
const DYNO_URL = 'https://plantopedia-heroku.herokuapp.com/';

const app = express();

app.listen(PORT, () => {
    wakeDyno(DYNO_URL); // Use this function when only needing to wake a single Heroku app.

  })

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.get('/', function (req, res, next) {
  res.render('home');
});

app.get('/upload', function (req, res, next) {
  res.render('upload');
});

app.get('/contact', function (req, res, next) {
  res.render('contact');
});

app.get('/about', function (req, res, next) {
  res.render('about');
});

app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: '/tmp/'
}));


app.post('/uploadimage', (req, res) => {
  console.log(req.files);
  const fs = require('fs'); // File System | Node.js
  const FormData = require('form-data'); // Readable "multipart/form-data" streams

  let form = new FormData();

  //console.log(req);
  form.append('organs', req.body.organs);
  form.append('images', fs.createReadStream(req.files.thefile.tempFilePath));

  try {
    fetch(
      'https://my-api.plantnet.org/v2/identify/all?api-key=' + process.env.PLANTNET_API_KEY,
      {
        method: 'POST',
        headers: form.getHeaders(),
        body: form,
      })
      .then(response => {
        if (response.status === 404) {
          res.status(404).send('We were not able to find a plant in this photo. Please try a different photo.');
        }
        return response.json()
      })
      .then(result => {
        res.send(JSON.stringify(result))
      })
      .catch(error => {
        console.error('Error:', error);
      });

  } catch (error) {
    console.error('error', error);
    res.send(JSON.stringify(error));
  }

});

app.post('/contact',  (req, res) => {
  
    //getting values from input fields
    var name = req.body.email;
    var text = req.body.text;

  fs.appendFileSync('contactform.csv', name +',' + text + '\n');

  res.redirect("/contact");
    });


app.listen(app.get('port'), function () {
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});