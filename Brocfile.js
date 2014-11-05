/* global require, module */

var EmberApp = require('ember-cli/lib/broccoli/ember-app');

var app = new EmberApp();

// IMPORT BOOTSTRAP
app.import('vendor/bootstrap/dist/css/bootstrap.min.css');
app.import('vendor/bootstrap/dist/js/bootstrap.min.js');

// IMPORT GLYPHICONS
var mergeTrees = require('broccoli-merge-trees');
var pickFiles = require('broccoli-static-compiler');
var extraAssets = pickFiles('vendor/bootstrap/dist/fonts',{
    srcDir: '/',
    files: ['**/*'],
    destDir: '/fonts'
});

// IMPORT P-NOTIFY
app.import('vendor/pnotify/pnotify.custom.css');
app.import('vendor/pnotify/pnotify.custom.js');

// IMPORT MOMENT.JS
app.import('vendor/moment/moment.js');

// IMPORT EMBER-SPIN-BOX
app.import('vendor/ember-spin-box/dist/ember-spin-box.min.css');
app.import('vendor/ember-spin-box/dist/ember-spin-box.min.js');

// IMPORT EMBER-DATE-PICKER
app.import('vendor/ember-date-picker/dist/ember-date-picker-custom.css');
app.import('vendor/ember-date-picker/dist/ember-date-picker-custom.js');


module.exports = mergeTrees([app.toTree(), extraAssets]);
