import Ember from 'ember';

export default Ember.ArrayController.extend({
    needs: ['application'],
    app_controller: Ember.computed.alias('controllers.application'),

    postTitle: null,
    postDescription: null

});
