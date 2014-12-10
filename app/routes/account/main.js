import Ember from 'ember';

export default Ember.Route.extend({
    beforeModel: function() {
        var app_controller = this.controllerFor('application'), controller = this.controllerFor('account.main');

        //imposto la tab company come default per 'your-profile'
        if( controller.tabList.paymentDetails !== true &&  controller.tabList.buyCredits !== true &&  controller.tabList.orderHistory !== true ) {
            controller.set('tabList.paymentDetails', true);
        }

        if( !app_controller.paymentPlans.get('length') ) {
            this.store.findQuery("payment-plan").then(function(val){
                app_controller.set("paymentPlans", val);
            }, function( reason ){
                app_controller.send( 'message_manager', 'Failure', reason );
            });
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
        },

        send_toStripe: function( attr, value ){
            var _this = this, app_controller = _this.controllerFor('application');

            if( this.controller.mm != null && this.controller.yyyy != null &&
                /^\d+$/.test(this.controller.cardNumber1) && /^\d+$/.test(this.controller.cardNumber2) &&
                /^\d+$/.test(this.controller.cardNumber3) && /^\d+$/.test(this.controller.cardNumber4)
                )
            {

                var data = this.getProperties(), customerData = this.getProperties();

                data.number = _this.controller.cardNumber1;
                data.number = data.number + _this.controller.cardNumber2;
                data.number = data.number + _this.controller.cardNumber3;
                data.number = data.number + _this.controller.cardNumber4;
                data.cvc = _this.controller.cvc;
                data.exp_month = _this.controller.mm;
                data.exp_year = _this.controller.yyyy;

                this.store.find('user', app_controller.user_id).then(function(user){
                    user.set('cardNumber', _this.controller.cardNumber4);
//                    .save().then(function( user_saved ){

                    Stripe.card.createToken(data, stripeResponseHandler);

                    function stripeResponseHandler(status, response) {
                        _this.controller.set('cvc', null);
                        _this.controller.set('mm', null);
                        _this.controller.set('yyyy', null);
                        _this.controller.set('cardNumber1', null);
                        _this.controller.set('cardNumber2', null);
                        _this.controller.set('cardNumber3', null);
                        _this.controller.set('cardNumber4', null);
                        _this.controller.set( attr, value );
                        if (response.error) {
                            // Show the errors on the form
                            new PNotify({ title: 'Error', text: response.error.message, type: 'warning', delay: 2000 });
                            _this.controller.set( attr, value );
                        } else {
                            // response contains id and card, which contains additional card details
                            customerData.token = response.id;
                            customerData.user_id = app_controller.user_id;

                            $.post('api/custom/customerCard?token=' + app_controller.token, customerData).then(function(response){
                                if (response.success) {
                                    new PNotify({
                                        title: 'Well done',
                                        text: 'You successfully save payment details',
                                        type: 'success',
                                        delay: 2000
                                    });

                                    user.save().then(function(){
                                        _this.controller.set('curr_pwd', null);
                                        _this.controller.set('new_pwd', null);
                                        _this.controller.set('confirm_pwd', null);
                                        _this.controller.set( attr, value );
                                    });
                                }
                            }, function(){
                                new PNotify({
                                    title: 'Error',
                                    text: 'A problem was occurred.',
                                    type: 'error',
                                    delay: 2000
                                });
                                _this.controller.set('curr_pwd', null);
                                _this.controller.set('new_pwd', null);
                                _this.controller.set('confirm_pwd', null);
                                _this.controller.set( attr, value );
                            });
                        }
                    }
                });

            } else {
                app_controller.send( 'message_manager', 'Failure', 'The payment details are not correct, please check them' );
                this.controller.set( attr, value );
            }
        },
        delete_plan: function( model, record ) {
            var _this = this, app_controller = _this.controllerFor('application');
            record.deleteRecord();
            record.save().then(function(val){
                _this.store.findQuery("paymentPlan").then(function(val){
                    app_controller.set("autocompletePaymentPlan", val);
                });
            });
        },

        new_refill: function(payment_id, company_id, user_id, $btn) {
            var _this = this, app_controller = _this.controllerFor('application'),
                today = new Date(), data = this.getProperties();

            this.store.find('payment-plan', payment_id ).then(function( payment ){
                data.paymentPlan = payment_id;
                data.date = moment(today).format("YYYY-MM-DD");
                data.amount = payment.get('amount');
                data.credit = payment.get('credit');
                data.currency = payment.get('currency');
                data.company = company_id;
                data.user = user_id;

                $.post('api/custom/refill?token=' + app_controller.token, data).then(function(response){

                    if (response.success) {
                        //company.reload();
                        $btn.set('disabled', false);

                        app_controller.send( 'message_manager', 'Success', 'You successfully save refill' );
                    }
                }, function(response){
                    var json = response.responseText, obj = JSON.parse(json);
                    $btn.set('disabled', false);
                    app_controller.send( 'message_manager', 'Failure', 'A problem was occurred' );

                });
            });

        },

        download_file: function( fileId ) {
            var _this = this, app_controller = _this.controllerFor('application'),
                path = 'api/files/' + fileId + '?token=' + app_controller.token + '&download=true';

            $.fileDownload(path)
                // .done(function () { alert('File download a success!'); })
                .fail(function () {
                    new PNotify({
                        title: 'Error',
                        text: 'The file was removed or cancelled.',
                        type: 'error',
                        delay: 4000
                    });
                });
        },

        stripe_connect_to: function( company_id ) {
            var _this = this, app_controller = _this.controllerFor('application'),
                path = 'https://connect.stripe.com/oauth/authorize?response_type=code&client_id='+ company_id;

            $.post(path)
                .done(function () { alert('File download a success!'); })
                .fail(function ( response ) {
                    new PNotify({
                        title: 'Error',
                        text: 'An error was occurred',
                        type: 'error',
                        delay: 4000
                    });
                });
        }
    }
});
