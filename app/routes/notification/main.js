import Ember from 'ember';

export default Ember.Route.extend({
    beforeModel: function() {
        var app_controller = this.controllerFor('application'), controller = this.controllerFor('notification.main');

        //imposto la tab company come default per 'your-profile'
        if (controller.tabList.general !== true && controller.tabList.linksRequest !== true) {
            controller.set('tabList.general', true);
        }

        var today = Date();
        var queryExpression = 'company='+app_controller.company_id;
       queryExpression = queryExpression+'&date={“gt”:"'+moment(today).format('YYYY-MM-DD HH:mm:ss:SSS Z')+'"}';
        app_controller.set('records_notifications', this.store.findQuery('notification', queryExpression));

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
            this.controller.set('tabList.linksRequest',false);

            this.controller.set('tabList.' + tabToActive, true);
//            this.controller.set('transition_to_list', true);
        },

        /**
         PUT su un record di un attributo
         @action set_record
         @for notification/main
         @param {object} uno specifico record di un model
         @param {string} attributo del record che deve essere modificato
         @param {object} nuovo valore dell'attributo
         */
        set_record: function( record, attr, value ) {
            record.set(attr, value).save();
        },

        open_modal: function( record, path, into, outlet, view ) {
            var controller = this.controllerFor('notification.main');

            controller.set('selectedRecord', record);

            this.render(path, {
                into: into,
                outlet: outlet,
                view: view
            });
        },

        /**
         riassegno un valore ad una variabile del controller

         @action change_state
         @for notification/main
         @param {string} attributo del record che deve essere modificato
         @param {object} nuovo valore dell'attributo
         */
        change_state: function( attr, value ) {

            this.controller.set(attr, value);
        },

        show_hide_notifications: function( attr1, value1 ) {
            this.send('change_state', attr1, value1);
        },

        /************************************
         *
         * */
        custom_acceptedLink: function( record, recordFrom, recordTo, actionToken ){
            var _this = this, app_controller = _this.controllerFor('application'),
                data = this.getProperties();

            data.actionFn = 'linkCompanies';

            $.post('api/action?actionToken=' + actionToken, data).then(function(response){
                if (response.success) {
                    record.set('actionToken', null);
                    record.set('highlighted', false).save();

                    recordTo.reload();

                    //SUCCESS
                    app_controller.send( 'message_manager', 'Success', 'You have successfully sent the document.' );
                }
            }, function( response ){
                //NOT SAVED
                app_controller.send( 'message_manager', 'Failure', response );
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
