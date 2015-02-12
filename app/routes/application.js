import Ember from 'ember';

export default Ember.Route.extend({
    beforeModel: function() {
        var app_controller = this.controllerFor('application');

        if( app_controller.company_id ) {
            this.store.find('company', app_controller.company_id).then(function( val ){
                app_controller.set('company_record', val);
            });
        } else {
            this.transitionTo('login/main');
        }

        if( app_controller.user_id ) {
            this.store.find('user', app_controller.user_id).then(function( val ){
                app_controller.set('user_record', val);
            });
        } else {
            this.transitionTo('login/main');
        }

        /** se non è presente in memoria il token l'utente viene ri-direzionato alla pagina di login **/
        if ( !app_controller.token_pdoc ){
            this.redirectToLogin();
        } else {
            this.redirectToDashboard();
        }
    },

    redirectToLogin: function() {
        this.transitionTo('login/main');
    },

    redirectToDashboard: function() {
        this.transitionTo('dashboard/main');
    },

    actions: {
        error: function( reason ) {
            var app_controller = this.controllerFor('application');

            switch ( String(reason.status) ){
                case '400':        //BAD REQUEST, problemi con il token
                    app_controller.send('logout');
                    break;
                case '401':
//                    new PNotify({
//                        title: 'Attention!',
//                        text: reason.message,
//                        type: 'error',
//                        delay: 2000
//                    });
                    break;
                case '403':    //FORBIDDEN, non deve generare errore
                    break;
                case '404':    //NOT FOUND
                    new PNotify({
                        title: 'Attention!',
                        text: reason.message,
                        type: 'error',
                        delay: 2000
                    });
                    break;
                case '500':  //INTERNAL SERVER ERROR, dato dal server
                    new PNotify({
                        title: 'Attention!',
                        text: reason.message,
                        type: 'error',
                        delay: 2000
                    });
                    break;
                default:
                    new PNotify({
                        title: 'Attention!',
                        text: 'Something went wrong: ' + reason.message,
                        type: 'error',
                        delay: 2000
                    });
                    this.redirectToDashboard();
                    break;
            }

        },
        closeSearch: function(){
            this.disconnectOutlet({
                outlet: 'search-result',
                parentView: "application"
            });
        },

        close_modal: function(outlet, parentView) {
            this.disconnectOutlet({
                outlet: outlet,
                parentView: parentView
            });
        },

        changeLanguage: function(val){
            this.controllerFor('application').set('isEnglish', val);
        },

        /**
         Link-to alla tab da cui si è arrivati

         @action return
         @for your-profile/driver-id
         @param {string} route della pagina - (your-profile.main-page)
         @param {string} tab selezionata dall'utente - (tabList.company/tabList.driver/tabList.truck/tabList.trailer/tabList.clerk)
         @param {key} tab selezionata dall'utente - (company/driver/truck/trailer/clerk)
         */
        return: function( page, tab, id ) {
            var controller = this.controllerFor( page );

            switch(page) {
                case 'your-profile/main-page':
                    controller.set('tabList.company', false);
                    controller.set('tabList.driver', false);
                    controller.set('tabList.truck', false);
                    controller.set('tabList.trailer', false);
                    controller.set('tabList.clerk', false);

                    controller.set(tab, true);

                    //this.transitionTo(page, id);
                    break;
//                case 'links/main-page':
//                    this.transitionTo(page, id);
//                    break;
            }

            this.transitionTo(page, id);
        },

        /**
         Cambio di una singola pagina da View a Edit mode. Nel caso in cui si passi da Edit a View verrà fatto un
         salvataggio del modello in questione.

         @action change_state
         @for [ partials/-company-field; ...]
         @param {string} route della pagina - [links/company; ]
         @param {boolean} valore con cui viene aggiornata variabile locale isView - true/false
         @param {string} nome di un model
         @param {number} unique key
         */
        change_state: function( route, value, model, id ) {
            var controller = this.controllerFor(route);

            if ( value === true ) {
                this.store.find(model, id).then(function(val){
                    val.save();
                });
            }

            controller.set('isView', value);
        },

        set_value: function( route, variable, value ) {
            var controller = this.controllerFor(route);

            controller.set(variable, value);
        },

        /*****************************
         * INFINITE SCROLL
         */
        getMore: function(){
            var self = this, controller = self.controllerFor('application'),
                items = [];

            // simulate latency
            Ember.run.later( function() {
                items = self.send('fetchPage', controller.firstIndex + 1, controller.perPage);
            }, 500);
        },

        fetchPage: function(firstIndex, perPage){
            var self = this, controller = self.controllerFor('application'),
                items = Ember.A([]),
                lastIndex  = firstIndex + perPage;

            if(firstIndex <= controller.queryExpressResults_length) {
                controller.queryExpressResults.forEach(function(equ, index){

                    if( index+1 >= firstIndex && index+1 <= lastIndex ) {
                        controller.items.pushObject(equ);
                        if(index+1 === controller.queryExpressResults_length){
                            controller.firstIndex = controller.queryExpressResults_length;
                            controller.set("searchResultList", controller.items);
                            return false;
                        }
                    } else if (index+1 > lastIndex){
                        controller.firstIndex = lastIndex;
                        controller.set("searchResultList", controller.items);
                        return false;
                    }
                });
            }
            this.get('controller').send('gotMore', items, firstIndex);
        },

        /**
         Alla creazione di un nuovo record vengono controllati i campi che devono avere un valore univoco; se esiste
         già un record con valore uguale viene avvertito l'utente e viene cancellato il campo.

         @action checkUniqueField
         @for New record
         @param {string} modello da interrogare
         @param {string} campo da cercare
         @param {string} value del campo da cercare
         @param {string} path del controller di riferimento
         */
        checkUniqueField: function( myModel, myFilter, myVal, path ){
            var self = this, controller = self.controllerFor(path),
                queryExpression = {}, searchPath = '';

            searchPath = myFilter; queryExpression[searchPath] = myVal;

            this.store.findQuery(myModel, queryExpression).then(function(val){
                if(val.get('length') === 1){
                    controller.set('newName', null);
                    //SUCCESS
                    new PNotify({
                        title: 'Attention',
                        text: 'Already exists an item with this '+ myFilter,
                        delay: 2000
                    });
                }
            });
        },

        linkto: function( path, record_id ){
            var self = this, controller = self.controllerFor('application');

            controller.set('company_id', record_id);
            controller.set('tabListDetails', false);
            controller.set('tabListUsers', false);
            controller.set('tabListFiles', false);

            this.transitionTo(path, record_id);
        },

        message_manager: function( type, text ){

            switch ( type ){
                case 'Success':
                    new PNotify({
                        title: 'Success',
                        text: text,
                        type: 'success',
                        delay: 2000
                    });
                    break;
                case 'Warning':
                    new PNotify({
                        title: 'Attention',
                        text: text,
                        delay: 2000
                    });
                    break;
                case 'Failure':
                    new PNotify({
                        title: 'Error',
                        text: text,
                        type: 'error',
                        delay: 2000
                    });
                    break;
            }
        }

    }
});

