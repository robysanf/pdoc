import Ember from 'ember';

export default Ember.Route.extend({
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
        }
    }
});
