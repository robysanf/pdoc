import Ember from 'ember';

export default Ember.Route.extend({
    beforeModel: function(){
        var _this = this, app_controller = _this.controllerFor('application');

        app_controller.set('records_company', this.store.findAll('company'));

    },

    model: function( company ) {
        return this.store.find('company', company.company_id);
    },

    actions: {
        transition_to: function( path, record ){
            switch ( path ){
                case 'your-profile/main':
                    this.transitionTo( path, record );
                    break;
            }
        },

        change_mode: function( attr, value ){
            var controller = this.controllerFor('link/main');

            controller.set( attr, value );
        },

        custom_linkCompanies: function( record, attr, value ){
            var _this = this, controller = _this.controllerFor('link.main'), app_controller = _this.controllerFor('application'),
                data = this.getProperties();

            data.company = record.get('id');
//            this.store.find('company', app_controller.company).then(function( record ){

                $.post('api/custom/linkCompanies?token=' + app_controller.token, data).then(function(response){
                    if (response.success) {
                        controller.set('company_to_link', null);
                        controller.set( attr, value );
                        record.reload();
                        //NOT SAVED
                        new PNotify({
                            title: 'Success',
                            text: 'The request was sent.',
                            type: 'success',
                            delay: 2000
                        });
                    }
                }, function(){
                    //NOT SAVED
                    new PNotify({
                        title: 'Not saved',
                        text: 'A problem has occurred.',
                        type: 'error',
                        delay: 2000
                    });
                });
//            });
        }

//        queryCompanies: function(query, deferred) {
//            this.store.find('company', { name: query.term })
//                .then(deferred.resolve, deferred.reject);
//        }
    }
});
