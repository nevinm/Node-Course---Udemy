const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

const port = process.env.PORT || 3000;
const app = express();

hbs.registerPartials(`${__dirname}/views/partials`);
app.set('view engine', 'hbs');
app.use(express.static(`${__dirname}/public`));
app.use((req, res, next) => { 
	const now = new Date().toString();
	const log = `${now}: ${req.method} ${req.url}`;

	fs.appendFileSync('server.log', log + '\n');
	next();
});

// app.use((req, res, next) => {
// 	res.render('maintenance.hbs');
// });

hbs.registerHelper('getCurrentYear', () => {
	return new Date().getFullYear();
});

// To pass the data into a helper, just put a space after the call - 'screamIt "test text"'
hbs.registerHelper('screamIt', (text) => {
	return text.toUpperCase();
});

app.get('/', (req, res) => {
	res.render('home.hbs', {
		pageTitle: "Home Page",
		welcomeMessage: "Really great UI here, keep it up!",
	});
});

app.get('/about', (req, res) => {
	res.render('about.hbs', {
		pageTitle: "About page",
	});
});

app.listen(port, () => {
	console.log(`Server is running up on port ${port}`);
});
