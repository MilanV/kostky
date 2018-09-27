var metalsmith = require('metalsmith');
var markdown = require('metalsmith-markdown');
var layouts = require('metalsmith-layouts');
var handlebars = require('handlebars');
var collections = require('metalsmith-collections');
var permalinks = require('metalsmith-permalinks');
var MomentHandler = require("handlebars.moment");
MomentHandler.registerHelpers(handlebars);
var moment = require('moment');

handlebars.registerHelper("debug", function(optionalValue) {
  console.log("Current Context");
  console.log("====================");
  console.log(this);

  if (optionalValue) {
    console.log("Value");
    console.log("====================");
    console.log(optionalValue);
  }
});

handlebars.registerHelper('fallback', function (a, b) {return a ? a : b;});

handlebars.registerHelper('iff', function(a, operator, b, opts) {
    var bool = false;
    switch(operator) {
       case '==':
           bool = a == b;
           break;
       case '>':
           bool = a > b;
           break;
       case '<':
           bool = a < b;
           break;
       default:
           throw "Unknown operator " + operator;
    }
 
    if (bool) {
        return opts.fn(this);
    } else {
        return opts.inverse(this);
    }
});

handlebars.registerHelper('date_filter', function(daterange, date) {
	var d_since = moment();
	var d_til = moment();
	switch(daterange) {
		case 'next year':
			d_til.add(1, 'y');
			break;
		case 'next week':
			d_til.add(1, 'w');
			break;
		case 'next month':
			d_til.add(1, 'm');
			break;
		case 'last year':
			d_since.subtract(1, 'y');
			break;
		default:
			throw "Unknown daterange " + daterange;
	}
	return moment(date).isBetween(d_since, d_til);
});


metalsmith(__dirname)
  .metadata({
    site: {
      name: 'Kostky.org',
      description: "Československé sdružení dospělých fanoušků LEGO",
      owner: "Kostky.org - CZ & SK sdružení dospělých fanoušků LEGO",
    }
  })
  .source('./src')
  .destination('./public')
   .use(collections({
   articles: {
     pattern: 'articles/**/*.md',
     sortBy: 'date',
     reverse: true
     },
   menupages: {
     sortBy: 'menuposition',
     reverse: false
     },
   vystavy: {
     pattern: 'vystavy/**/*.md',
     sortBy: 'datum_do',
     reverse: true
     },
   }))
  .use(markdown())
  .use(permalinks({
    relative: false,
    pattern: ':title',
  }))
  .use(layouts({
    engine: 'handlebars',
    directory: './layouts',
    default: 'article.html',
    pattern: ["*/*/*html","*/*html","*html"],
    partials: {
      header: 'partials/header',
      footer: 'partials/footer',
      menupages: 'partials/menupages',
      vystavy: 'partials/vystavy',
    }
  }))
  .build(function (err) {
    if (err) {
      console.log(err);
    }
    else {
      console.log('Kostky postaveny!');
    }
  });
