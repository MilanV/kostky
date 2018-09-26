var metalsmith = require('metalsmith');
var markdown = require('metalsmith-markdown');
var layouts = require('metalsmith-layouts');
var handlebars = require('handlebars');
var collections = require('metalsmith-collections');
var permalinks = require('metalsmith-permalinks');
var MomentHandler = require("handlebars.moment");
MomentHandler.registerHelpers(handlebars);

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
