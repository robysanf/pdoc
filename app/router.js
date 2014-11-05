import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
    this.route('login/main', {path: 'login'});
    this.route('dashboard/main', {path: 'dashboard'});
});

export default Router;
