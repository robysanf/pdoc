import Ember from 'ember';

export default Ember.Route.extend({
    beforeModel: function() {
        var app_controller = this.controllerFor('application'), controller = this.controllerFor('your-profile.main');

        //imposto la tab company come default per 'your-profile'
        if( controller.tabList.company !== true &&  controller.tabList.driver !== true &&  controller.tabList.truck !== true &&  controller.tabList.trailer !== true &&  controller.tabList.clerk !== true ) {
            controller.set('tabList.company', true);
        }

//        //, {name: 'service'}
//        this.store.find("tag").then(function(val){
//            app_controller.set("auto_suggest_Services", val);
//        });
//
//        //, {name: 'segment'}
//        this.store.find("tag").then(function(val){
//            app_controller.set("auto_suggest_Segments", val);
//        });
//
//        //, {name: 'area'}
//        this.store.find("tag").then(function(val){
//            app_controller.set("auto_suggest_Areas", val);
//        });
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
            this.controller.set('tabList.company',false);
            this.controller.set('tabList.driver',false);
            this.controller.set('tabList.truck',false);
            this.controller.set('tabList.trailer',false);
            this.controller.set('tabList.clerk',false);

            this.controller.set('tabList.' + tabToActive, true);
            this.controller.set('transition_to_list', true);
        },

        /**
         Gestione delle transizioni tra parziali

         @action transition_to
         @for your-profile/main-page
         @param {string} path del parziale che si vuole a lyout
         @param {record} entità legate a company - (driver/truck/trailer/clerk)
         */
        transition_to: function( path, record ) {
           switch ( path ) {
               case 'your-profile/partials/-user-field':
                   this.controller.set( 'sub_record', record );
                   this.controller.set( 'transition_to_list', false );
                   break;
               case 'your-profile/partials/-vehicle-field':
                   this.controller.set( 'sub_record', record );
                   this.controller.set( 'transition_to_list', false );
                   break;
               case 'your-profile/tabs/-tabs-list':
                   this.controller.set( 'sub_record', record );         //record === null
                   this.controller.set( 'transition_to_list', true );
                   break;

           }
        },

        create_record: function( record_company, path, value ){
            var _this = this, app_controller = _this.controllerFor('application'), new_user;

            if ( _this.controller.tabList.driver ) {
                new_user = this.store.createRecord('user', {
                    type: 'powerUser',
                    company: record_company,
                    profile: 'driver'
                });

            } else if ( _this.controller.tabList.clerk ) {
                new_user = this.store.createRecord('user', {
                    type: 'powerUser',
                    company: record_company,
                    profile: 'clerk'
                });

            } else if ( _this.controller.tabList.truck ) {
                new_user = this.store.createRecord('vehicle', {
                    type: 'truck',
                    company: record_company
                });

            } else if ( _this.controller.tabList.trailer ) {
                new_user = this.store.createRecord('vehicle', {
                    type: 'trailer',
                    company: record_company
                });
            }

            _this.controller.set( 'sub_record', new_user );
            _this.controller.set( 'transition_to_list', false );
            app_controller.send( 'change_state', path, value );

        },

        set_record: function( path, value ) {
            var _this = this, app_controller = _this.controllerFor('application');

            _this.controller.sub_record.save().then(function(saved_record){
                app_controller.send( 'message_manager', 'success', 'You have successfully save the record.' );

                _this.controller.set( 'transition_to_list', true );
                app_controller.send( 'change_state', path, value );
            }, function( text ){
                app_controller.send( 'message_manager', 'error', text );
            });

        },

        open_modal: function( path, record_to_delete, record) {
            var _this = this, app_controller = _this.controllerFor('application'), controller = _this.controllerFor('your-profile/main');

            switch (path){
                case 'your-profile/modals/delete-record':
                    controller.set('main_record', record);
                    controller.set('record_to_delete', record_to_delete);

                    break;
            }

            this.render(path, {
                into: 'application',
                outlet: 'overview',
                view: 'modal-manager'
            });
        },

        remove_record: function() {
            var _this = this, app_controller = _this.controllerFor('application'), controller = _this.controllerFor('your-profile/main');

            controller.record_to_delete.deleteRecord();
            controller.record_to_delete.save().then(function(){
                controller.main_record.reload();
            });

        }
    }
});
