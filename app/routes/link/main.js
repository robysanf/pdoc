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
        }//,

//        queryCompanies: function(query, deferred) {
//            this.store.find('company', { name: query.term })
//                .then(deferred.resolve, deferred.reject);
//        }
    }
});
