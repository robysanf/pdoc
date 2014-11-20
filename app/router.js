import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
    this.route('dashboard/main', {path: 'dashboard'});
    this.route('login/main', {path: 'login'});

    this.route('your-profile/main', {path: 'yourProfile/:company_id'});
    this.route('link/main', {path: 'links/:company_id'});
});

export default Router;
