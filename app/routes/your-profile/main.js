import Ember from 'ember';

export default Ember.Route.extend({
    beforeModel: function() {
        var _this = this, app_controller = _this.controllerFor('application'), controller = _this.controllerFor('your-profile.main');

        //imposto la tab company come default per 'your-profile'
//        var uno = controller.tabList.company, due = controller.tabList.driver, tre = controller.tabList.truck, quattro = controller.tabList.trailer, cinque = controller.tabList.clerk;
//        if( uno !== true &&  due !== true &&  tre !== true &&  quattro !== true &&  cinque !== true ) {
            controller.set('tabList.company', true);
            controller.set('isView', true);
            controller.set('isView_docList', true);
//        }

        app_controller.set('records_companyCertifier', this.store.find('company', { type: "certifier" }));

//        //, {name: 'service'}
//        this.store.find("tag").then(function(val){ app_controller.set("auto_suggest_Services", val); });
//
//        //, {name: 'segment'}
//        this.store.find("tag").then(function(val){ app_controller.set("auto_suggest_Segments", val); });
//
//        //, {name: 'area'}
//        this.store.find("tag").then(function(val){ app_controller.set("auto_suggest_Areas", val); });
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

            switch ( tabToActive ){
                case 'company':
                    this.controller.set('isView', true);
                    this.controller.set('isView_docList', true);
                    this.controller.set('isView_docDetails', true);
                    break;
                default:
                break;
            }
        },

        /**
         Gestione delle transizioni tra parziali

         @action transition_to
         @for your-profile/main-page
         @param {string} path del parziale che si vuole a lyout
         @param {record} entità legate a company - (driver/truck/trailer/clerk)
         */
        transition_to: function( path, record, var1, value1, var2, value2 ) {
            var _this = this, app_controller = _this.controllerFor('application');
           switch ( path ) {
               case 'your-profile/partials/-user-field':
                   this.controller.set( 'sub_record', record );
                   this.controller.set( 'transition_to_list', false );
                   this.send('set_variable', var1, value1);
                   break;
               case 'your-profile/partials/-vehicle-field':
                   this.controller.set( 'sub_record', record );
                   this.controller.set( 'transition_to_list', false );
                   this.send('set_variable', var1, value1);
                   break;
               case 'your-profile/tabs/-tabs-list':
                   this.controller.set( 'sub_record', record );         //record === null
                   this.controller.set( 'transition_to_list', true );
                   this.send('set_variable', var1, value1);
                   break;
               case 'your-profile/partials/-company-document-edit':
                   this.controller.set( 'sub_record', record );

                   app_controller.company_record.get('certifier').then(function( record ){
                       app_controller.set('records_docTemplate', _this.store.find('docTemplate', { company: record.get('id') }));
                   });

                   this.send('set_variable', var1, value1);
                   this.send('set_variable', var2, value2);
                   break;
               case 'your-profile/partials/-tab-user-driver-list':
                   this.controller.set( 'sub_record', record );
                   this.send('set_variable', var1, value1);
                   this.send('set_variable', var2, value2);
                   break;
           }
        },

        /************************************************************
         * viene richiamata l'azione PUT
         * 
         * @param type
         * @param path
         * @param value
         */
        set_record: function( type, path, value, companyRecord ) {
            var _this = this, app_controller = _this.controllerFor('application');

            switch (type) {
                case 'document':
                    companyRecord.get('certifier').then(function( certifier ){
                        _this.controller.sub_record.set( 'certifier', certifier );

                        Ember.RSVP.all([
                            _this.controller.sub_record.get('certifier'),
                        ]).then(function() {
                            _this.controller.sub_record.save().then(function(saved_record){
                                app_controller.send( 'message_manager', 'Success', 'You have successfully saved the document.' );
                                _this.controller.set( path, value );

//                            }, function( text ){
//                                app_controller.send( 'message_manager', 'Failure', text );
                            });
                        }, function( error ){
                            app_controller.send( 'message_manager', 'Failure', 'Something went wrong, the record was not saved.' );
                        });
                    });
                    break;
                case 'user_vehicle':
                    _this.controller.sub_record.save().then(function(saved_record){
                        app_controller.send( 'message_manager', 'Success', 'You have successfully saved the post.' );

                        _this.controller.set( 'transition_to_list', true );
                        app_controller.send( 'change_state', path, value );
                    }, function( text ){
                        app_controller.send( 'message_manager', 'Failure', text );
                    });

                    break;
                case 'company_details':
                        companyRecord.save().then(function(saved_record){
                            app_controller.send( 'message_manager', 'Success', 'You have successfully saved the post.' );

                            _this.controller.set( path, value );
                        }, function( text ){
                            app_controller.send( 'message_manager', 'Failure', text );
                        });
                    break;
            }
        },
        
        set_variable: function( attr, value ){
            this.controller.set( attr, value );
        },

        create_record: function( record_company, path, value, attr1, val1 ){
            var _this = this, app_controller = _this.controllerFor('application'), new_record;

            if ( _this.controller.tabList.company ) {
                var today = new Date();

                new_record = this.store.createRecord('document', {
                    entityType: 'company',
                    date: moment(today).format(),
                    type: 'document',
                    status: 'active'
                });

                app_controller.company_record.get('certifier').then(function( certifier ){
                    new_record.set('company', record_company);
                    new_record.set('certifier', certifier);

                    Ember.RSVP.all([
                        new_record.get('company'),
                        new_record.get('certifier'),
                    ]).then(function() {

                        new_record.get('certifier').then(function( record ) {
                            app_controller.set('records_docTemplate', _this.store.find('docTemplate', { company: record.get('id') }));
                        });
                    }.bind(this));

                    _this.controller.set( attr1, val1 );
                });

            } else if ( _this.controller.tabList.driver ) {
                new_record = this.store.createRecord('user', {
                    type: 'powerUser',
                    company: record_company,
                    profile: 'driver'
                });
                _this.controller.set( 'isView', false );

            } else if ( _this.controller.tabList.clerk ) {
                new_record = this.store.createRecord('user', {
                    type: 'powerUser',
                    company: record_company,
                    profile: 'clerk'
                });
                _this.controller.set( 'isView', false );

            } else if ( _this.controller.tabList.truck ) {
                new_record = this.store.createRecord('vehicle', {
                    type: 'truck',
                    company: record_company
                });
                _this.controller.set( 'isView', false );

            } else if ( _this.controller.tabList.trailer ) {
                new_record = this.store.createRecord('vehicle', {
                    type: 'trailer',
                    company: record_company
                });
                _this.controller.set( 'isView', false );
            }

            _this.controller.set( 'sub_record', new_record );
            _this.controller.set( 'transition_to_list', false );
            _this.controller.set( path, value );

        },

        /************************************************************
         * apertura di un modale nella pagina corrente
         * 
         * @param path
         * @param record_to_delete
         * @param record
         */
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

        delete_record: function() {
            var _this = this, app_controller = _this.controllerFor('application'), controller = _this.controllerFor('your-profile/main');

            controller.record_to_delete.deleteRecord();
            controller.record_to_delete.save().then(function(){
                controller.main_record.reload();
            });
        },

        /*  FILES TAB
         * ******************
        faccio il reload del record a cui sono stati aggiunti i files

         @action update_files
         @for Booking - Files Tab
         @param {Number} - unique key
         @param {String}
         @param {String}
         */
        update_files: function(mod, val, $btn){
            this.store.find( mod, val ).then(function( record ){
                record.reload().then(function(){
                    $btn.button('reset');
                });
            });
        },

        /**
         l'utente può scaricare un file

         @action download_file
         @for Booking Item List
         @param {record}
         */
        download_file: function( fileId ) {
            var self = this, app_controller = self.controllerFor('application'),
                path = 'api/files/' + fileId + '?token=' + app_controller.token + '&download=true';

            $.fileDownload(path)
                // .done(function () { alert('File download a success!'); })
                .fail(function ( text ) {
                    app_controller.send( 'message_manager', 'Failure', text );
                });
        }
    }
});
