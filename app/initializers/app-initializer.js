import Ember from 'ember';

export default {
    name: "app_init",

        initialize: function(container, application) {
        container.typeInjection('component', 'store', 'store:main');
        application.register('global:variables', app_init, {singleton: true});
        application.inject('controller', 'app_init', 'global:variables'); //mi serve per inserire il valore del token al login
        application.inject('adapter', 'app_init', 'global:variables');   //mi serve per inserire il token nell'url delle chiamate al server
    }
};

var app_init = Ember.Object.extend({
    token_pdoc: localStorage['token_pdoc']
});