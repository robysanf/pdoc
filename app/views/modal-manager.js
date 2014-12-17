import Ember from 'ember';

export default Ember.View.extend({
    didInsertElement: function() {
        Ember.run.next(this,function(){
            this.$('.modal, .modal-backdrop').addClass('in');
        });
    },

    layoutName: 'modal-layout',
    actions: {
        delete_record: function(outlet, parentView){

            this.controller.send('delete_record');
            this.send( 'close', outlet, parentView);
        },

        change_password: function( curr_pwd, new_pwd, confirm_pwd, outlet, parentView ){
            var view = this, data = this.getProperties();

            data.user = view.controller.sub_record.get('username');
            data.token = view.get('controller.controllers.application').token;
            data.curr_pwd = curr_pwd;
            data.new_pwd = new_pwd;
            data.confirm_pwd = confirm_pwd;

            if( data.new_pwd === data.confirm_pwd ){
                $.post('api/custom/changePassword?token=' + view.get('controller.controllers.application').token, data).then(function(response){
                    if (response.success) {
                        new PNotify({ title: 'Well done', text: 'You successfully changed password.', type: 'success', delay: 2000 });
                    }
                }, function(){
                    new PNotify({ title: 'Warning', text: 'Password incorrect, please check it.', type: 'error', delay: 2000 });
                });
            }else{
                new PNotify({ title: 'Warning', text: 'The new passwords do not match, please check them.', type: 'error', delay: 2000 });
            }
            this.send( 'close', outlet, parentView);
        },

        //creazione di un nuovo payment plan da parte di un certificatore
        new_plan: function( type, planName, planDescription, planAmount, planCurrency, planCredit, outlet, parentView ){
            var _this = this;

            this.controller.get('store').createRecord('paymentPlan', {
                name: planName,
                type: type,
                description: planDescription,
                amount: planAmount,
                currency: planCurrency,
                credit: planCredit,
                company: this.controller.get('main_record')
            }).save().then(function( val ){
                _this.get('controller.controllers.application').set('records_paymentPlans', _this.controller.get('store').find('payment-plan', { company:  _this.get('controller.controllers.application').company_id }));
                _this.controller.get('main_record').reload();
                _this.send( 'close', outlet, parentView);

                _this.controller.set('type', null).set('planName', null).set('planDescription', null).set('planAmount', null).set('planCurrency', null).set('planCredit', null);
            });
        },

        //azione custom per le azioni di certificazione da parte del certificatore e per i rating da parte delle company
        // che si sono fatte vicevolmente delle prestazioni
        custom_rateDocument: function( type, rating, isLimited, description, actionToken, outlet, parentView ){
            var view = this, data = this.getProperties();
            data.rating = rating;
            data.isLimited = isLimited;
            data.description = description;

            if( type === 'certificationRating' ){
                data.actionFn = 'certificationRateDocument';
                $.post('api/action?actionToken=' + actionToken, data).then(function(response){
                    if (response.success) {
                        this.controller.selectedRecord.set('actionToken', null);
                        this.controller.selectedRecord.save().then(function(){
                            new PNotify({ title: 'Well done', text: 'You successfully send the rate.', type: 'success', delay: 2000 });
                        });
                    }
                }, function( error ){
                    new PNotify({ title: 'Warning', text: error, type: 'error', delay: 2000 });
                });
            } else if ( type === 'serviceRating' ){
                data.actionFn = 'serviceRateDocument';
                $.post('api/action?actionToken=' + actionToken, data).then(function(response){
                    if (response.success) {
                        this.controller.selectedRecord.set('actionToken', null);
                        this.controller.selectedRecord.save().then(function(){
                            new PNotify({ title: 'Well done', text: 'You successfully send the rate.', type: 'success', delay: 2000 });
                        });
                    }
                }, function( error ){
                    new PNotify({ title: 'Warning', text: error, type: 'error', delay: 2000 });
                });
            }

            view.controller.set('description', null);
            view.send( 'close', outlet, parentView);
        },

        createRecord_user: function( type, newFirstName, newLastName, newUsername, newBirthDate, newPatents, newPhone, newSkype, newEmail, newPassword, newLanguages, newCurriculum, outlet, parentView ){
            var view = this;

            var new_record = this.controller.get('store').createRecord('user', {
                type: type,
                company: this.controller.main_record,
                firstName: newFirstName,
                lastName: newLastName,
                username: newUsername,
                birthDate: newBirthDate,
                phone: newPhone,
                skype: newSkype,
                email: newEmail,
                password: newPassword
            });

            if( type === 'driver' ){
                new_record.set('profile', 'user').set('patents', newPatents).set('languages', newLanguages).set('curriculum', newCurriculum).save().then(function(){
                    view.controller.main_record.reload();
                    view.send( 'close', outlet, parentView);
                });
            } else {
                new_record.save().then(function(){
                    view.controller.main_record.reload();
                    view.send( 'close', outlet, parentView);
                });
            }
            view.controller.set('newFirstName', null).set('newLastName', null).set('newBirthDate', null).set('newPhone', null).set('newSkype', null).set('newEmail', null).set('newUsername', null).set('newPassword', null);
        },
        createRecord_vehicle: function( type, newName, newBrand, newModel, newDescription, newConfigurations, newRegistrationYear, newChassisNumber, newWeight, newTare, newCategory, outlet, parentView ){
            var view = this;

            var new_record = this.controller.get('store').createRecord('vehicle', {
                type: type,
                company: this.controller.main_record,
                name: newName,
                brand: newBrand,
                model: newModel,
                description: newDescription,
                configurations: newConfigurations,
                registrationYear: newRegistrationYear
            });

            if( type === 'trailer' ){
                new_record.set('chassisNumber', 'newChassisNumber').set('weight', newWeight).set('tare', newTare).set('category', newCategory).save().then(function(){
                    view.controller.set('configurations', null);
                    view.controller.main_record.reload();
                    view.send( 'close', outlet, parentView);
                });
            } else {
                new_record.save().then(function(){
                    view.controller.main_record.reload();
                    view.send( 'close', outlet, parentView);
                });
            }

            view.controller.set('newConfigurations', []).set('newName', null).set('newBrand', null).set('newModel', null).set('newDescription', null).set('newRegistrationYear', null).set('newChassisNumber', null).set('newWeight', null).set('newTare', null).set('newCategory', null);


        },
        close: function(outlet, parentView) {
            var view = this;

            this.$('.modal, .modal-backdrop').one("transitionend", function() {
                view.controller.send( 'close_modal', outlet, parentView );
            });

            this.$('.modal').removeClass('in');
        }
    }
});
