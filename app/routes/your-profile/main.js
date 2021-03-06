import Ember from 'ember';

export default Ember.Route.extend({
    beforeModel: function() {
        var _this = this, app_controller = _this.controllerFor('application'), controller = _this.controllerFor('your-profile.main'),
            data = this.getProperties();

        controller.set('tabList.company', true);
        controller.set('tabList.driver', false);
        controller.set('tabList.truck', false);
        controller.set('tabList.trailer', false);
        controller.set('tabList.clerk', false);

        controller.set('isView', true);
        controller.set('isView_docList', true);

        controller.set('record_isNew', false);

        this.store.find('company', app_controller.company_id).then(function( record ){
            record.get('links').then(function( allRecord ){
                  var allCompany = allRecord.filter( function( company ){
                       if( company.get('type') === 'certifier' && company.get('publishableKey') ){
                           return company;
                       }
                  });

                app_controller.set('records_companyCertifier', allCompany);
            });
        });

        //app_controller.set('records_companyCertifier', this.store.find('company', { type: "certifier",  }));

        if( app_controller.user_type === 'driver' ){
            _this.store.find( 'user', app_controller.user_id ).then(function( record ){
                controller.set( 'sub_record', record );
            });
        }

        data.model = 'company';
        data.field = 'service';
        $.post('api/custom/tag?token=' + app_controller.token_pdoc, data).then(function(response){
            app_controller.set('auto_suggest_Services', response.tags);
        }, function( response ){
            app_controller.send( 'message_manager', 'Failure', response );
        });

        data.field = 'segment';
        $.post('api/custom/tag?token=' + app_controller.token_pdoc, data).then(function(response){
            app_controller.set('auto_suggest_Segments', response.tags);
        }, function( response ){
            app_controller.send( 'message_manager', 'Failure', response );
        });

        data.field = 'area';
        $.post('api/custom/tag?token=' + app_controller.token_pdoc, data).then(function(response){
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


        set_variable: function( attr, value ){
            this.controller.set( attr, value );
        },

        /**
         Gestione della tab navigation in 'your-profile'; rende attiva la tab selezionata dall'utente

         @action setTabs
         @for your-profile/main-page
         @param {string} tab selezionata dall'utente - (company/driver/truck/trailer/clerk)
         */
        setTabs: function( tabToActive ){
            var _this = this, app_controller = _this.controllerFor('application');

            this.controller.set('tabList.company',false);
            this.controller.set('tabList.driver',false);
            this.controller.set('tabList.truck',false);
            this.controller.set('tabList.trailer',false);
            this.controller.set('tabList.clerk',false);

            this.controller.set('tabList.' + tabToActive, true);
            this.controller.set('transition_to_list', true);
            this.controller.set('record_isNew', false);
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

                   /** se non è un supplier inizializzo la lista di doc-template in base al certificatore della company in questione */
                   if( app_controller.company_type !== "supplier" ) {
                       app_controller.company_record.get('certifier').then(function( record ){

                           if( _this.controller.tabList.company ){
                               app_controller.set('records_docTemplate', _this.store.find('docTemplate', { company: record.get('id'), type: 'company' }));
                           } else  if( _this.controller.tabList.driver ){
                               app_controller.set('records_docTemplate', _this.store.find('docTemplate', { company: record.get('id'), type: 'driver' }));
                           } else  if( _this.controller.tabList.truck ){
                               app_controller.set('records_docTemplate', _this.store.find('docTemplate', { company: record.get('id'), type: 'truck' }));
                           } else  if( _this.controller.tabList.trailer ){
                               app_controller.set('records_docTemplate', _this.store.find('docTemplate', { company: record.get('id'), type: 'trailer' }));
                           }
                       });
                   }


                   this.send('set_variable', var1, value1);
                   this.send('set_variable', var2, value2);
                   break;
               case 'your-profile/partials/-company-document-list':
                   if( this.controller.record_isNew ){
                       record.deleteRecord();
                       record.save();
                   }

                   this.controller.set( 'sub_record_document', record );
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

                        if( _this.controller.sub_record_document.get('type') === 'document' ){
                            _this.controller.sub_record_document.save().then(function( saved_record ){
                                if( _this.controller.tabList.company ){
                                    companyRecord.reload().then(function(){
                                        _this.controller.set('record_isNew', false);
                                        app_controller.send( 'message_manager', 'Success', 'You have successfully saved the document.' );
                                        _this.controller.set( path, value );
                                    });
                                } else {
                                    companyRecord.reload().then(function(){
                                        _this.controller.set('record_isNew', false);
                                        app_controller.send( 'message_manager', 'Success', 'You have successfully saved the document.' );
                                        _this.controller.set( path, value );
                                    });
                                }

                            });
                        } else {
                            _this.controller.sub_record_document.set('validityDate', null).set('deadline', null).set('grace', null).set('alert', null);

                            _this.controller.sub_record_document.save().then(function( saved_record ){
                                if( _this.controller.tabList.company ){
                                    companyRecord.reload().then(function(){
                                        app_controller.send( 'message_manager', 'Success', 'You have successfully saved the document.' );
                                        _this.controller.set('record_isNew', false);
                                        _this.controller.set( path, value );
                                    });

                                } else {
                                    companyRecord.reload().then(function(){
                                        app_controller.send( 'message_manager', 'Success', 'You have successfully saved the document.' );
                                        _this.controller.set('record_isNew', false);
                                        _this.controller.set( path, value );
                                    });
                                }
                            });
                        }

                    });
                    break;
                case 'user_vehicle':
                    _this.controller.sub_record.save().then(function( saved_record ){
                        app_controller.send( 'message_manager', 'Success', 'You have successfully saved the post.' );
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
                    var $btn = $(this);
                    $btn.button('loading');

                    record.get('files').then(function( allFiles ){
                        var files_length = allFiles.get('length');
                        if( files_length !== 0 ){
                            allFiles.forEach(function( file, index ){
                                if( file.get('type') === 'LOGO' ){
                                    file.deleteRecord();
                                    file.save();
                                }
                                if(files_length === index + 1 ){
                                    $.ajax({
                                        url: 'api/files?token='+ app_controller.token_pdoc +'&entity='+record.get('id')+'&type=logo',
                                        type: "POST",
                                        data: app_controller.formData,
                                        processData: false,
                                        contentType: false
                                    }).then(function(){
                                        $btn.button('reset');
                                        app_controller.formData = new FormData();
                                        app_controller.formData_size = null;
                                        record.reload();
                                        _this.controller.set( attr, value );

                                    }, function(){
                                        $btn.button('reset');
                                        new PNotify({title: 'Error',text: 'A problem was occurred.',type: 'error',delay: 4000});
                                    });

                                }
                            });
                        } else {
                            $.ajax({
                                url: 'api/files?token='+ app_controller.token_pdoc +'&entity='+record.get('id')+'&type=logo',
                                type: "POST",
                                data: app_controller.formData,
                                processData: false,
                                contentType: false
                            }).then(function(){
                                $btn.button('reset');
                                app_controller.formData = new FormData();
                                app_controller.formData_size = null;
                                record.reload();
                                _this.controller.set( attr, value );

                            }, function(){
                                $btn.button('reset');
                                new PNotify({title: 'Error',text: 'A problem was occurred.',type: 'error',delay: 4000});
                            });
                        }

                    });


                }
            } else {
                _this.controller.set( attr, value );
            }

        },



        /**
         *   creazione di un nuovo record
         *
         * */

        create_record: function( record_company, path, value, attr1, val1, type ){
            var _this = this, app_controller = _this.controllerFor('application'), new_record;

            /** COMPANY TAB */
            if ( _this.controller.tabList.company ) {
                var today = new Date();

                new_record = this.store.createRecord('document', {
                    canEdit: true,
                    canRemove: true,
                    entity: record_company.get('id'),
                    entityType: 'company',
                    date: moment(today).format('YYYY-MM-DD HH:mm:ss'),
                    status: 'active',
                    isCertified: false
                });

                record_company.get('certifier').then(function( certifier ){
                    new_record.set('company', record_company);
                    new_record.set('certifier', certifier);

                    Ember.RSVP.all([
                        new_record.get('company'),
                        new_record.get('certifier'),
                    ]).then(function() {

                        new_record.save().then(function( savedRecord ){
                            _this.controller.set('record_isNew', true);
                            //savedRecord
                            savedRecord.get('certifier').then(function( record ) {
                                app_controller.set('records_docTemplate', _this.store.find('docTemplate', { company: record.get('id'), type: 'company' }));
                            });
                        });
                    }.bind(this));

                    _this.controller.set( attr1, val1 );
                    _this.controller.set( 'sub_record_document', new_record );
                });

                /** DRIVER TAB */
            } else if ( _this.controller.tabList.driver ) {

                if( type === 'document' ){
                    new_record = this.store.createRecord('document', {
                        canEdit: true,
                        canRemove: true,
                        entity:  _this.controller.sub_record.get('id'),
                        entityType: 'user',
                        date: moment(today).format(),
                        status: 'active',
                        isCertified: false
                    });

                    record_company.get('certifier').then(function( certifier ){
                        new_record.set('company', record_company);
                        new_record.set('certifier', certifier);

                        Ember.RSVP.all([
                            new_record.get('company'),
                            new_record.get('certifier'),
                        ]).then(function() {
                            new_record.save().then(function( savedRecord ){
                                _this.controller.set('record_isNew', true);
                                savedRecord.get('certifier').then(function( record ) {
                                    app_controller.set('records_docTemplate', _this.store.find('docTemplate', { company: record.get('id'), type: 'driver' }));
                                });
                            });

                        }.bind(this));

                        _this.controller.set( attr1, val1 );
                        _this.controller.set( 'sub_record_document', new_record );
                    });
                }

                /** CLERK TAB */
            } else if ( _this.controller.tabList.clerk ) {


                /** TRUCK TAB */
            } else if ( _this.controller.tabList.truck ) {

                if( type === 'document' ){
                    new_record = this.store.createRecord('document', {
                        canEdit: true,
                        canRemove: true,
                        entity:  _this.controller.sub_record.get('id'),
                        entityType: 'vehicle',
                        date: moment(today).format(),
                        status: 'active',
                        isCertified: false
                    });

                    record_company.get('certifier').then(function( certifier ){
                        new_record.set('company', record_company);
                        new_record.set('certifier', certifier);

                        Ember.RSVP.all([
                            new_record.get('company'),
                            new_record.get('certifier'),
                        ]).then(function() {
                            new_record.save().then(function( savedRecord ){
                                _this.controller.set('record_isNew', true);
                                savedRecord.get('certifier').then(function( record ) {
                                app_controller.set('records_docTemplate', _this.store.find('docTemplate', { company: record.get('id'), type: 'truck' }));
                            });
                            });
                        }.bind(this));

                        _this.controller.set( attr1, val1 );
                        _this.controller.set( 'sub_record_document', new_record );
                    });
                }

                /** TRAILER TAB */
            } else if ( _this.controller.tabList.trailer ) {
                if( type === 'document' ){
                    new_record = this.store.createRecord('document', {
                        canEdit: true,
                        canRemove: true,
                        entity:  _this.controller.sub_record.get('id'),
                        entityType: 'vehicle',
                        date: moment(today).format(),
                        status: 'active',
                        isCertified: false
                    });

                    record_company.get('certifier').then(function( certifier ){
                        new_record.set('company', record_company);
                        new_record.set('certifier', certifier);

                        Ember.RSVP.all([
                            new_record.get('company'),
                            new_record.get('certifier'),
                        ]).then(function() {
                            new_record.save().then(function( savedRecord ){
                                _this.controller.set('record_isNew', true);
                                savedRecord.get('certifier').then(function( record ) {
                                app_controller.set('records_docTemplate', _this.store.find('docTemplate', { company: record.get('id'), type: 'trailer' }));
                            });
                            });
                        }.bind(this));

                        _this.controller.set( attr1, val1 );
                        _this.controller.set( 'sub_record_document', new_record );
                    });
                }
            }


            _this.controller.set( 'transition_to_list', false );
            _this.controller.set( path, value );

        },

        /**
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
                    //controller.set('main_record', record);
                    controller.set('record_to_delete', record_to_delete);
                    break;
                case 'your-profile/modals/new-record':
                    controller.set('main_record', record);
                    controller.set('record_type', type);
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
            controller.record_to_delete.save();//.then(function(){
               // controller.main_record.reload();
//            });
        },


        /**
         faccio il reload del record a cui sono stati aggiunti i files

         @action update_files
         @for Booking - Files Tab
         @param {Number} - unique key
         @param {String}
         @param {String}
         */

        update_files: function(mod, val, $btn){
            this.store.find( mod, val ).then(function( record ){
                record.save();
                $btn.button('reset');
                //record.reload();
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
                path = 'api/files/' + fileId + '?token=' + app_controller.token_pdoc + '&download=true';

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
        custom_notifyDocument: function( document_record ){
            var self = this, app_controller = self.controllerFor('application'),
                data = this.getProperties();


            data.document = document_record.get('id');

            $.post('api/custom/notifyDocument?token=' + app_controller.token_pdoc, data).then(function(response){
                if (response.success) {
                    document_record.set('isCertified', true).save();
                    app_controller.send( 'message_manager', 'Success', 'You have successfully sent the document.' );
                }
            }, function( response ){
                app_controller.send( 'message_manager', 'Failure', response );
            });
        },

        /**
         invio richiesta per cambio certificatore

         @action custom_setCertifier
         @for your-profile/partials/-field-company.hbs
         @param {company_id} id della company certificatrice
         */
        custom_setCertifier: function( company_id ){
            var self = this, app_controller = self.controllerFor('application'),
                data = this.getProperties();

            data.company = company_id;

            $.post('api/custom/setCertifier?token=' + app_controller.token_pdoc, data).then(function(response){
                if (response.success) {

//                    self.store.find('company', company_id).then(function( record ){
//                        Stripe.setPublishableKey( record.get('publishableKey') );
//                    });

                    app_controller.send( 'message_manager', 'Success', 'You have successfully add the certifier.' );
                }
            }, function( response ){
                var json = response.responseText, result = JSON.parse(json);
                var error = result.error;
                app_controller.send( 'message_manager', 'Failure', error );
            });
        },

        /**
         invio richiesta per rimozione certificatore

         @action custom_removeCertifier
         @for your-profile/partials/-field-company.hbs

         */
        custom_removeCertifier: function( record ){
            var self = this, app_controller = self.controllerFor('application');

            $.post('api/custom/removeCertifier?token=' + app_controller.token_pdoc).then(function(response){
                if (response.success) {
                    record.set('certifier', null);
//                    Stripe.setPublishableKey( null );
                    app_controller.send( 'message_manager', 'Success', 'You have successfully remove the certifier.' );
                }
            }, function( response ){
                var json = response.responseText, result = JSON.parse(json);
                var error = result.error;
                app_controller.send( 'message_manager', 'Failure', error );
            });
        },


        custom_showRating: function( record, type ){
            var _this = this, data = _this.getProperties(), app_controller = _this.controllerFor('application');

                record.get('ratings').then(function( ratings ){



                    data.company = record.get('id');
                    switch ( type ){
                        case 'service':
                            $.post('api/custom/companyServiceScore?token=' + app_controller.token_pdoc, data).then(function(response){
                                if( response.success ){
                                    record.set('serviceScore', response.score);
                                    record.set('visualizationCredit', response.visualizationCredit);
                                } else {
                                    app_controller.send( 'message_manager', 'Failure', response.error );
                                }

                            }, function( response ){
                                app_controller.send( 'message_manager', 'Failure', response.error );

                            });


                            break;
                        case 'certification':
                            $.post('api/custom/companyCertificationScore?token=' + app_controller.token_pdoc, data).then(function(response){
                                if( response.success ){
                                    record.set('certificationScore', response.score);
                                    record.set('visualizationCredit', response.visualizationCredit);
                                } else {
                                    app_controller.send( 'message_manager', 'Failure', response.error );
                                }
                            }, function(response){
                                app_controller.send( 'message_manager', 'Failure', response.error );

                            });
                            break;
                    }
                });
        }
    }
});
