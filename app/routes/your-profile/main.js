import Ember from 'ember';

export default Ember.Route.extend({
    beforeModel: function() {
        var _this = this, app_controller = _this.controllerFor('application'), controller = _this.controllerFor('your-profile.main'),
            data = this.getProperties();

        //imposto la tab company come default per 'your-profile'
//        var uno = controller.tabList.company,
//            due = controller.tabList.driver,
//            tre = controller.tabList.truck,
//            quattro = controller.tabList.trailer,
//            cinque = controller.tabList.clerk;
//        if( uno !== true &&  due !== true &&  tre !== true &&  quattro !== true &&  cinque !== true ) {
        controller.set('tabList.company', true);
        controller.set('tabList.driver', false);
        controller.set('tabList.truck', false);
        controller.set('tabList.trailer', false);

        controller.set('isView', true);
        controller.set('isView_docList', true);
//        }

        app_controller.set('records_companyCertifier', this.store.find('company', { type: "certifier" }));

        data.model = 'company';
        data.field = 'service';
        $.post('api/custom/tag?token=' + app_controller.token, data).then(function(response){
            app_controller.set('auto_suggest_Services', response.tags);
        }, function( response ){
            app_controller.send( 'message_manager', 'Failure', response );
        });

        data.field = 'segment';
        $.post('api/custom/tag?token=' + app_controller.token, data).then(function(response){
            app_controller.set('auto_suggest_Segments', response.tags);
        }, function( response ){
            app_controller.send( 'message_manager', 'Failure', response );
        });

        data.field = 'area';
        $.post('api/custom/tag?token=' + app_controller.token, data).then(function(response){
            app_controller.set('auto_suggest_Areas', response.tags);
        }, function( response ){
            app_controller.send( 'message_manager', 'Failure', response );
        });
    },

    model: function( company ) {
        var _this = this, app_controller = _this.controllerFor('application');
        app_controller.set('temp_company_id', company.company_id);

        return _this.store.find('company', company.company_id);


    },

    afterModel: function(){
        var _this = this, app_controller = _this.controllerFor('application'),
            isLinked = false;
        /******************************************************************************
        * CONTROLLO PER LA CREAZIONE DI DOCUMENTI SU COMPANY
        *
        * solo utente di tipo clerk/admin associato ad una company linked o proprietaria
        * */
        if( String( app_controller.company_id ) === String( app_controller.temp_company_id ) ){         // se l'utente è associato alla company
            app_controller.set('isLinked', true);
        } else {
            _this.store.find( 'company', app_controller.company_id ).then(function( companyRecord ){
                companyRecord.get('links').then(function( linkedCompanies ){
                    linkedCompanies.filter(function( company_record, index ){
                        if( String(company_record.get('id')) === String(app_controller.temp_company_id) ){      //se la company è di tipo linked
                            isLinked = true;
                        }

                        if( index+1 === linkedCompanies.get('length')){
                            app_controller.set('isLinked', isLinked);
                        }
                    });
                });
            });
        }
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
                case 'driver':
                    this.controller.set('isView_docList', true);
                    break;
                case 'truck':
                    this.controller.set('isView_docList', true);
                    break;
                case 'trailer':
                    this.controller.set('isView_docList', true);
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
                   this.controller.set( 'sub_record_document', record );

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
                        _this.controller.sub_record_document.set( 'certifier', certifier );

                        _this.controller.sub_record_document.save().then(function( saved_record ){
                            app_controller.send( 'message_manager', 'Success', 'You have successfully saved the document.' );
                            _this.controller.set( path, value );
                        });
                    });
                    break;
                case 'user_vehicle':
                    _this.controller.sub_record.save().then(function( saved_record ){
                        app_controller.send( 'message_manager', 'Success', 'You have successfully saved the post.' );

//                        _this.controller.set( 'transition_to_list', true );
                        _this.controller.set( path, value );
                    }, function( text ){
                        app_controller.send( 'message_manager', 'Failure', text );
                    });

                    break;
                case 'company_details':
                        companyRecord.save().then(function( saved_record ){
                            app_controller.send( 'message_manager', 'Success', 'You have successfully saved the post.' );

                            _this.controller.set( path, value );
                        }, function( text ){
                            app_controller.send( 'message_manager', 'Failure', text );
                        });
                    break;
            }
        },

        save_logo: function( record, attr, value ){
            var _this = this, app_controller = _this.controllerFor('application');

            if(app_controller.formData_size !== null){

                if(app_controller.formData.size > '10000000') {     //verifico che il file sia meno grande di 10 Mega-Byte
                    new PNotify({title: 'Warning',text: 'The file must be smaller than 10 MB.',type: 'info',delay: 4000});
                    _this.controller.set( attr, value );
                } else {
                    var self = this, $btn = $(this);
                    $btn.button('loading');

                    $.ajax({
                        url: 'api/files?token='+ app_controller.token +'&entity='+record+'&type=logo',
                        type: "POST",
                        data: app_controller.formData,
                        processData: false,
                        contentType: false
                    }).then(function(){
                        $btn.button('reset');
                        app_controller.formData = new FormData();
                        app_controller.formData_size = null;
                        _this.controller.set( attr, value );

                    }, function(){
                        $btn.button('reset');
                        new PNotify({title: 'Error',text: 'A problem was occurred.',type: 'error',delay: 4000});
                    });

                }
            } else {
                _this.controller.set( attr, value );
            }

        },


        set_variable: function( attr, value ){
            this.controller.set( attr, value );
        },

        create_record: function( record_company, path, value, attr1, val1, type ){
            var _this = this, app_controller = _this.controllerFor('application'), new_record;

            if ( _this.controller.tabList.company ) {
                var today = new Date();

                new_record = this.store.createRecord('document', {
                    canEdit: true,
                    entity: record_company.get('id'),
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
                            app_controller.set('records_docTemplate', _this.store.find('docTemplate', { company: record.get('id'), type: 'company' }));
                        });
                    }.bind(this));

                    _this.controller.set( attr1, val1 );
                    _this.controller.set( 'sub_record_document', new_record );
                });

            } else if ( _this.controller.tabList.driver ) {

                if( type === 'document' ){
                    new_record = this.store.createRecord('document', {
                        entity:  _this.controller.sub_record.get('id'),
                        entityType: 'user',
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
                                app_controller.set('records_docTemplate', _this.store.find('docTemplate', { company: record.get('id'), type: 'driver' }));
                            });
                        }.bind(this));

                        _this.controller.set( attr1, val1 );
                        _this.controller.set( 'sub_record_document', new_record );
                    });
                } else {
                    new_record = this.store.createRecord('user', {
                        type: 'user',
                        company: record_company,
                        profile: 'driver'
                    });

                    _this.controller.set( 'isView', false );
                    _this.controller.set( 'sub_record', new_record );

                }
            } else if ( _this.controller.tabList.clerk ) {
                new_record = this.store.createRecord('user', {
                    type: 'powerUser',
                    company: record_company,
                    profile: 'clerk'
                });
                _this.controller.set( 'isView', false );
                _this.controller.set( 'sub_record', new_record );

            } else if ( _this.controller.tabList.truck ) {

                if( type === 'document' ){
                    new_record = this.store.createRecord('document', {
                        entity:  _this.controller.sub_record.get('id'),
                        entityType: 'user',
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
                                app_controller.set('records_docTemplate', _this.store.find('docTemplate', { company: record.get('id'), type: 'truck' }));
                            });
                        }.bind(this));

                        _this.controller.set( attr1, val1 );
                        _this.controller.set( 'sub_record_document', new_record );
                    });
                } else {
                    new_record = this.store.createRecord('vehicle', {
                        type: 'truck',
                        company: record_company
                    });
                    _this.controller.set('isView', false);
                    _this.controller.set( 'sub_record', new_record );
                }

            } else if ( _this.controller.tabList.trailer ) {
                if( type === 'document' ){
                    new_record = this.store.createRecord('document', {
                        entity:  _this.controller.sub_record.get('id'),
                        entityType: 'user',
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
                                app_controller.set('records_docTemplate', _this.store.find('docTemplate', { company: record.get('id'), type: 'trailer' }));
                            });
                        }.bind(this));

                        _this.controller.set( attr1, val1 );
                        _this.controller.set( 'sub_record_document', new_record );
                    });
                } else {
                    new_record = this.store.createRecord('vehicle', {
                        type: 'trailer',
                        company: record_company
                    });
                    _this.controller.set( 'isView', false );
                    _this.controller.set( 'sub_record', new_record );
                }
            }


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
        open_modal: function( path, record_to_delete, record, type) {
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
        },

        /*********************************** FUNZIONI CUSTOM ***********************************/

        /**
         invio richiesta per rating

         @action custom_notifyDocument
         @for your-profile/partials/-company-documents-list.hbs
         @param {document_id} id del documento su cui fare rating
         */
        custom_notifyDocument: function( document_id ){
            var self = this, app_controller = self.controllerFor('application'),
                data = this.getProperties();

            data.document = document_id;

            $.post('api/custom/notifyDocument?token=' + app_controller.token, data).then(function(response){
                if (response.success) {
                    app_controller.send( 'message_manager', 'Success', 'You have successfully sent the document.' );
                }
            }, function( response ){
                app_controller.send( 'message_manager', 'Failure', response );
            });
        },

        /*********************************** FUNZIONI CUSTOM ***********************************/

        /**
         invio richiesta per cambio certificatore

         @action custom_notifyDocument
         @for your-profile/partials/-field-company.hbs
         @param {company_id} id della company certificatrice
         */
        custom_setCertifier: function( company_id ){
            var self = this, app_controller = self.controllerFor('application'),
                data = this.getProperties();

            data.company = company_id;

            $.post('api/custom/setCertifier?token=' + app_controller.token, data).then(function(response){
                if (response.success) {
                    app_controller.send( 'message_manager', 'Success', 'You have successfully sent the request.' );
                }
            }, function( response ){
                app_controller.send( 'message_manager', 'Failure', response );
            });
        },

        custom_showRating: function( record_id, type ){
            var _this = this, data = _this.getProperties(), app_controller = _this.controllerFor('application');

            data.company = record_id;
            switch ( type ){
                case 'service':
                    $.post('api/custom/companyServiceScore?token=' + app_controller.token, data).then(function(response){
                    }, function( response ){
                        new PNotify({ title: 'Warning', text: response, type: 'error', delay: 2000 });
                    });
                    break;
                case 'certification':
                    $.post('api/custom/companyCertificationScore?token=' + app_controller.token, data).then(function(response){
                    }, function(response){
                        new PNotify({ title: 'Warning', text: response, type: 'error', delay: 2000 });
                    });
                    break;
            }
        }
    }
});
