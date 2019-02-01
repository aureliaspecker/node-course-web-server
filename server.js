const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

var app = express();

hbs.registerPartials(__dirname + '/views/partials')
app.set('view engine', 'hbs');

app.use((req, res, next) => {   //next exists to tell when the middleware software is done - so if we do something asynchronous, nothing will happen
    var now = new Date().toString();
    var log = `${now}: ${req.method} ${req.url}`;

    console.log(log);
    fs.appendFile('server.log', log + '\n', (err) => {
        if (err) {
            console.log('Unable to append to server.log.')
        }
    });
    next();                     //if you don't call next() the call will never execute
 });

// app.use((req, res, next) => {
//     res.render('maintenance.hbs', {
//         pageTitle: 'Maintenance',
//         welcomeMessage: 'The site is currently being updated, we will be back soon'
//     });
// });             //if we don't call next() in this function this middleware is going to stop everything that's after it from executing and so your website will render the maintenance page, regardless of the path (the handlers will never get executed)

app.use(express.static(__dirname + '/public'));       //in order to add some middlewear (__dirname stores the path to your directory). You can now access the HTML help page at http://localhost:3000/help.html

hbs.registerHelper('getCurrentYear', () => {
    return new Date().getFullYear()
});

hbs.registerHelper('screamIt', (text) => {
    return text.toUpperCase();
});

app.get('/', (req, res) => {
    res.render('home.hbs', {
        pageTitle: 'Home Page',
        welcomeMessage: 'Welcome to this website'
    });
});

app.get('/about', (req, res) => {
    res.render('about.hbs', {
        pageTitle: 'About Page'
    });
});

app.get('/bad', (req, res) => {
    res.send({
        errorMessage: 'Unable to fulfill this request'
    });
});

app.listen(3000, () => {
    console.log('Server is up on port 3000');
});