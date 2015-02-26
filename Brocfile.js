/* global require, module */

//var EmberAddon = require('ember-cli/lib/broccoli/ember-addon');
//
//var app = new EmberAddon();
var EmberApp = require('ember-cli/lib/broccoli/ember-app');
//
var app = new EmberApp();

// IMPORT BOOTSTRAP
app.import('vendor/readable-bootstrap/bootstrap.min.css');
app.import('vendor/select2-bootstrap/select2-bootstrap.css');
app.import('vendor/jasny-bootstrap/dist/css/jasny-bootstrap.min.css');    //per load image
app.import('vendor/bootstrap/dist/js/bootstrap.min.js');
app.import('vendor/jasny-bootstrap/dist/js/jasny-bootstrap.min.js');     //per load image

// IMPORT GLYPHICONS
var mergeTrees = require('broccoli-merge-trees');
var pickFiles = require('broccoli-static-compiler');
var extraAssets = pickFiles('vendor/bootstrap/dist/fonts',{
    srcDir: '/',
    files: ['**/*'],
    destDir: '/fonts'
});

// IMPORT STRIPE
app.import('vendor/stripe/stripe-2.min.js');
app.import('vendor/stripe/stripe_key.js');

// IMPORT P-NOTIFY
app.import('vendor/pnotify/pnotify.custom.css');
app.import('vendor/pnotify/pnotify.custom.js');

//// IMPORT MOMENT.JS
app.import('vendor/moment/moment.js');

// IMPORT FILE-DOWNLOAD.JS
app.import('vendor/jquery-ui/jquery.fileDownload.js');

//module.exports = app.toTree();
module.exports = mergeTrees([app.toTree(), extraAssets]);

