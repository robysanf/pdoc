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
            var _this = this;
            var new_record = this.store.createRecord('doc-template', {
                company: record_company
            });

            new_record.save().then(function( recrod ){
                _this.controller.set( 'new_record', recrod);
                _this.send('change_mode', attr, value );
            });
        },

        set_record: function( record, attr, value ){
            var _this = this;

            switch (attr){
                case 'view_new_field':
                    record.save().then(function(){
                        _this.send('change_mode', attr, value );
                    });
                    break;
                case 'mode_view':
                    record.save().then(function(){
                        _this.send('change_mode', attr, value );
                    });
                    break;
                default :
                    record.set(attr, value);
                    break
            }
        },

        delete_record: function() {
            var _this = this, app_controller = _this.controllerFor('application'), controller = _this.controllerFor('your-profile/main');

            controller.record_to_delete.deleteRecord();
            controller.record_to_delete.save().then(function(){
                app_controller.send('message_manager', 'Success', 'The document was successfully removed.');
//                controller.main_record.reload();
            }, function(){
                app_controller.send('message_manager', 'Failure', 'A problem eas occurred.');
            });
        },

//        delete_record: function( record ){
//            var _this = this, app_controller = _this.controllerFor('application');
//            record.deleteRecord();
//            record.save().then(function(){
//                app_controller.send('message_manager', 'Success', 'The document was successfully removed.');
//            }, function(){
//                app_controller.send('message_manager', 'Failure', 'A problem eas occurred.');
//            });
//        },

        open_modal: function( path, record_to_delete, record) {
            var _this = this, app_controller = _this.controllerFor('application'), controller = _this.controllerFor('your-profile/main');

            switch (path){
                case 'admin/modals/delete-record':
//                    controller.set('main_record', record);
                    controller.set('record_to_delete', record_to_delete);

                    break;
            }

            this.render(path, {
                into: 'application',
                outlet: 'overview',
                view: 'modal-manager'
            });
        },

        update_files: function(mod, val, $btn){
            this.store.find( mod, val ).then(function( record ){
                record.reload().then(function(){
                    $btn.button('reset');
                });
            });
        }
    }
});
