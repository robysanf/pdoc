import Ember from 'ember';

export default Ember.Route.extend({
    beforeModel: function() {
        var app_controller = this.controllerFor('application'), controller = this.controllerFor('account.main');

        //imposto la tab company come default per 'your-profile'
        if( controller.tabList.paymentDetails !== true &&  controller.tabList.buyCredits !== true &&  controller.tabList.orderHistory !== true ) {
            controller.set('tabList.paymentDetails', true);
        }
    },
    model: function( company ) {
        return this.store.find('company', company.company_id);
    },

    actions: {
        /**
         Gestione della tab navigation in 'your-profile'; rende attiva la tab selezionata dall'utente

         @action setTabs
         @for your-profile/main-page
         @param {string} tab selezionata dall'utente - (company/driver/truck/trailer/clerk)
         */
        setTabs: function( tabToActive ){
            this.controller.set('tabList.paymentDetails',false);
            this.controller.set('tabList.buyCredits',false);
            this.controller.set('tabList.orderHistory',false);

            this.controller.set('tabList.' + tabToActive, true);
//            this.controller.set('view_new_field', false);
        },

        change_mode: function( attr, value ){
            this.controller.set( attr, value );
        }
    }
});
