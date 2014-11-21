import Ember from 'ember';

export default Ember.Route.extend({
    beforeModel: function() {
        var app_controller = this.controllerFor('application'), controller = this.controllerFor('admin.main');

        //imposto la tab company come default per 'your-profile'
        if( controller.tabList.company !== true &&  controller.tabList.driver !== true &&  controller.tabList.truck !== true &&  controller.tabList.trailer !== true &&  controller.tabList.general !== true ) {
            controller.set('tabList.general', true);
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
            this.controller.set('tabList.general',false);
            this.controller.set('tabList.company',false);
            this.controller.set('tabList.driver',false);
            this.controller.set('tabList.truck',false);
            this.controller.set('tabList.trailer',false);

            this.controller.set('tabList.' + tabToActive, true);
            this.controller.set('view_new_field', false);
        },

        change_mode: function( attr, value ){
            this.controller.set( attr, value );
        },

        create_record: function( record_company, attr, value ){

            var new_record = this.store.createRecord('doc-template', {
                company: record_company
            });

            this.controller.set( 'new_record', new_record );
            this.send('change_mode', attr, value );
        },

        set_record: function( record, attr, value ){
            var _this = this;

            if(attr !== 'view_new_field'){
                record.set(attr, value);
            } else {
                record.save().then(function(){
                    _this.send('change_mode', attr, value );
                });
            }

        }
    }
});
