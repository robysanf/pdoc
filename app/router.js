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
    this.route('notification/main', {path: 'notifications/:company_id'});

    this.route('admin/main', {path: 'admin/:company_id'});
    this.route('account/main', {path: 'account/:company_id'});
    this.route('cal');
});

export default Router;
