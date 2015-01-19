import Ember from 'ember';

export default Ember.Controller.extend({
    needs: ['application'],
    app_controller: Ember.computed.alias('controllers.application'),

    myList: [],
    newLog: 0,
    companyTypeList: [
        'carrier',
        'shipper',
        'supplier',
        'certifier'
    ],

    lan_it: {
        language: 'Lingua', english: 'Inglese', italian: 'Italiano', signUp: 'Registrati', login: 'Autenticati', backToLogin: 'Indietro', email: 'E-mail', password: 'Password',
        userName: 'Username', lastName: 'Cognome', firstName: 'Nome', selectACompanyType: 'Seleziona una tipo di società', selectACompany: 'Seleziona una società', zipCode: 'CAP',
        city: 'Città', street: 'Via', vatNumber: 'Cod. fiscale', name: 'Nome', newCompany: 'Nuova società', newUser: 'Nouvo utente', privacy: 'Privacy', terms: 'Termini', about: 'Chi siamo'
    },
    lan_en: {
        language: 'Language', english: 'English', italian: 'Italian', signUp: 'Sign up', login: 'Login', backToLogin: 'Back to login', email: 'E-mail', password: 'Password',
        userName: 'Username', lastName: 'Last name', firstName: 'First name', selectACompanyType: 'Select a company type', selectACompany: 'Select a company', zipCode: 'Zip code',
        city: 'City', street: 'Street', vatNumber: 'Vat number', name: 'Name', newCompany: 'New company', newUser: 'New user', privacy: 'Privacy', terms: 'Terms', about: 'About'
    },

    translationType: function(){
        switch(this.isEnglish){
            case 'english':
                return this.lan_en.english;
            case 'italian':
                return this.lan_it.italian;
            default:
                return this.lan_en.english;
        }
    }.property('isEnglish'),

    isEnglish: 'default',
    translation: function(){
        switch(this.isEnglish){
            case 'english':
                return this.lan_en;
            case 'italian':
                return this.lan_it;
            default:
                return this.lan_en;
        }
    }.property('isEnglish'),

    reset: function() {
        this.get('controllers.application').set('is_login', true);
        this.setProperties({
            username: '',
            password: '',
            //errorMessage: '',
            newLog: 0,
            firstName: '',
            lastName: '',
            pwd:'',
            userEmail: '',
            name:'',
            vatNumber: '',
            street: '',
            city: '',
            zipCode: '',
            country: '',
            email: '',
            companyType: 'client'
        });
    },
    actions:{
        login: function() {

            var self = this, data = this.getProperties('username', 'password');

            $.post('api/auth', data).then(function(response){
                if (response.success) {

                    //inizializzo variabili globali in application
                    self.get('controllers.application').set('company_id', response.company_id);
                    self.get('controllers.application').set('token', response.token);
                    self.get('controllers.application').set('company_type', response.company_type);
                    self.get('controllers.application').set('user_id', response.user_id);
                    self.get('controllers.application').set('user_type', response.userType);
                    self.get('controllers.application').set('is_admin', String(response.isAdmin));
                    self.get('controllers.application').set('comp_country', String(response.country));

                    if( stripe_publishableKey !== '' ){
                        Stripe.setPublishableKey(stripe_publishableKey);
                    } else {
                        this.store.find('company', response.company_id).then(function( record ){
                            if( record.get('type') === 'certifier' ) {
                                Stripe.setPublishableKey(record.get('publishableKey'));
                            } else {
                                record.get('certifier').then(function( subRecord ){
                                    Stripe.setPublishableKey(subRecord.get('publishableKey'));
                                });
                            }
                        });
                    }


                    self.store.find('company', response.company_id ).then(function( val ){
                        self.get('controllers.application').set('company_record', val);

                        self.get('controllers.application').company_record.reload();
                    });
                    self.transitionToRoute('dashboard/main');
                    self.get('controllers.application').set('is_login', false);
                }
            }, function(){
                new PNotify({
                    title: 'Warning',
                    text: 'Username or password incorrect, please check them.',
                    type: 'error'
                });
            });
        }
    }
});
