import Ember from 'ember';

export default Ember.Route.extend({
    beforeModel: function(){
        var app_controller = this.controllerFor('application');

        app_controller.set('records_posts', this.store.findQuery('post', { sortOrder: 'descendent', sortBy: 'date' } ));
    },

//    model: function() {
//        var _this = this, controller = _this.controllerFor('dashboard.main');
//        //return this.store.find('post');
//        return this.store.filter('post', { sortOrder: 'descendent', sortBy: 'date' }, function( post ) {
//            return post;
//        });
////
////        controller.set('orderedPosts', allPosts);
//
//    },

    actions: {
        delete_record: function( record_to_remove ){
            record_to_remove.deleteRecord();
            record_to_remove.save();

        },

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

                var onSuccess = function( ) {
                    app_controller.send( 'message_manager', 'Success', 'You have successfully saved the record.' );

                    _this.controller.set('postTitle', null);
                    _this.controller.set('postDescription', null);

                    app_controller.set('records_posts', _this.store.findQuery('post', { sortOrder: 'descendent', sortBy: 'date' } ));


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
