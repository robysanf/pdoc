import Ember from 'ember';

export default Ember.Route.extend({

    model: function( ) {
        return this.store.find('post');
    },

    actions: {
            submit: function( record ){
                var _this = this, app_controller = _this.controllerFor('application');

                var new_record = _this.store.createRecord('post', {
                    name: "Post",
                    title: _this.controller.postTitle,
                    description: _this.controller.postDescription,
                    date: moment().format()
                });

                // belongsTo set() here
                new_record.set('company', record);

                Ember.RSVP.all([
                    new_record.get('company'),
                ]).then(function() {

                    var onSuccess = function() {
                        app_controller.send( 'message_manager', 'Success', 'You have successfully saved the record.' );
                        _this.controller.postTitle = null;
                        _this.controller.postDescription = null;
                    }.bind(this);

                    var onFail = function() {
                        app_controller.send( 'message_manager', 'Failure', 'Something went wrong, the record was not saved.' );
                    }.bind(this);

                    // Save inside then() after I call get() on promises
                    new_record.save().then(onSuccess, onFail);

                }.bind(this));
            }
    }


});
