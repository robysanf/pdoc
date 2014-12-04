import Ember from 'ember';

export default Ember.Controller.extend({
    is_login: false,
    LOG_TRANSITIONS: true,

    visibility: [
        'private',
        'public'
    ],

    company_record: null,
    /*****************************
     * LOCAL STORAGE
     */
    user_record: JSON.parse(localStorage["user_record"] ? localStorage["user_record"] : "[\" \"]"),

    company_id: localStorage['company_id'],
    token: localStorage['token'],
    company_type: localStorage['company_type'],
    user_id: localStorage['user_id'],
    //username: localStorage['username'],  //univoco per un utente
    //userProfile: localStorage['userProfile'],
    //companyProfile: localStorage['companyProfile'],
    //selectedDepot: localStorage['selectedDepot'],
    //isAdmin: localStorage['isAdmin'],

    company_idChanged: function() { localStorage.company_id = this.company_id; }.observes('company_id'),
    tokenChanged: function() {
        localStorage.token = this.token;
        this.app_init.set('token', this.token);
    }.observes('token'),

    company_typeChanged: function() { localStorage.company_type = this.company_type; }.observes('company_type'),
    user_idChanged: function() { localStorage.user_id = this.user_id; }.observes('user_id'),
    //usernameChanged: function() { localStorage.username = this.username; }.observes('username'),
    //userProfileChanged: function() { localStorage.userProfile = this.userProfile; }.observes('userProfile'),
    //companyProfileChanged: function() { localStorage.companyProfile = this.companyProfile; }.observes('companyProfile'),

    //selectedDepotChanged: function() { localStorage.selectedDepot = this.selectedDepot; }.observes('selectedDepot'),
    //isAdminChanged: function() { localStorage.isAdmin = this.isAdmin; }.observes('isAdmin'),


    /**********************
     auto-suggest
     */
    auto_suggest_Services: Ember.A(),
    auto_suggest_Segments: Ember.A(),
    auto_suggest_Areas: Ember.A(),
    auto_suggest_Configurations: Ember.A(),
    /*****************************
     * AUTOCOMPLETE
     */

    records_company: Ember.A(),
    records_docTemplate: Ember.A(),
    records_companyCertifier: Ember.A(),

    autocompleteUser: [],
    autocompleteCompany: [],

    autocomplete_patents: Ember.A([
        Ember.Object.create({id: 1, type: "AM"}),
        Ember.Object.create({id: 2, type: "A1"}),
        Ember.Object.create({id: 3, type: "A2"}),
        Ember.Object.create({id: 4, type: "A"}),
        Ember.Object.create({id: 5, type: "B"}),
        Ember.Object.create({id: 6, type: "B1"}),
        Ember.Object.create({id: 7, type: "BE"}),
        Ember.Object.create({id: 8, type: "C1"}),
        Ember.Object.create({id: 9, type: "C1E"}),
        Ember.Object.create({id: 10, type: "C"}),
        Ember.Object.create({id: 11, type: "CE"}),
        Ember.Object.create({id: 12, type: "D1"}),
        Ember.Object.create({id: 13, type: "D1E"}),
        Ember.Object.create({id: 14, type: "D"}),
        Ember.Object.create({id: 15, type: "KA"}),
        Ember.Object.create({id: 16, type: "KB"})
    ]),


    /*****************************
     * INFINITE SCROLL
     */
    firstIndex: 0,
    perPage: 25,
    queryExpressResults: null,
    queryExpressResults_length: null,
    isAll: false,
    items: Ember.A(),
    searchResultList: Ember.A(),
    searchResults: function() { return this.searchResultList; }.property('searchResultList'),


    /*****************************
     * LANGUAGE
     */
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
    lan_it: {
        publicToYourContactsNetwork: 'Pubblica alla tua rete di contatti', companyDetails: "Anagrafica", invoiceNumber: 'Numero fattura', rate: 'Punteggio', limit: 'Limite', goodsConfiscation: 'Confisca', vehicleConfiscation: 'Sequestro', fiscalResponsibility: 'Resp.Fiscale',
        validity: 'Validità', alert: 'Avviso', grace: 'Grazia', loadModel: 'Carica modello', attach: 'Allega', premium: 'Avanzato', medium: 'Intermedio', smart: 'Base', for: 'Per', euro: 'Euro',
        byNow: 'Acquista ora!', amount: 'Totale', cardNumber: 'Numero di carta', account: 'Cliente', general: 'Generale', postToYourLinks: 'Pubblica alla tua rete di contatti', submit: 'Pubblica',
        news: 'Nuove', hideNotifications: 'Notifiche nascoste', emas: 'Emas', admin: 'Admin', extra: 'Extra', certifier: 'Certificatore', send: 'Certifica', template: 'Template',
        paymentDetails: 'dettagli pagamento', credits: 'Crediti', orderHistory: 'Storico cliente', buyCredits: 'Acquisto crediti', newDocument: 'documento', hideLinkRequests: 'Richieste di connessione nascoste',
        showHideLinkRequests: 'Mostra le richieste di connessione nascoste...', resume: 'Rigenera', date: 'Data', close: 'Chiudi', gracePeriod: 'Periodo di grazia',
        more: 'Dettagli', deadline: 'Scadenza', value: 'Valore', certificate: 'Certifica', download: 'Scarica', hide: 'Nascondi', note: 'Note', highlight: 'In evidenza',
        showHideNotifications: 'Mostra le notifiche nascoste...', linkRequests: 'Richieste di connessione', notifications: 'Notifiche', save: 'Salva', type: 'Tipo',
        edit: 'Modifica', country: 'Paese', logo: 'Logo', links: 'Links', new: 'Nuovo', return: 'Indietro', chassisNumber: 'Targa', registrationYear: 'Anno di immatricolazione',
        configuration: 'Configurazione', category: 'Categoria', tare: 'Tara', weight: 'Peso complessivo', linksRequest: 'Richieste di collegamento', generals: 'Generali',
        model: 'Modello', brand: 'Marca', view: 'Visualizza', goTo: 'Vai', delete: 'Cancella', lastName: 'Cognome', firstName: 'Nome', curriculum: 'Curriculum', searchCompanies: 'Ricerca',
        languages: 'Lingue', skype: 'Contatto Skype', phone: 'Telefono', patents: 'Patenti', language: 'Lingua', english: 'Inglese', italian: 'Italiano', yourProfile: 'Il tuo profilo', name: "Nome",
        profile: "Profilo", company: 'Società', transportListCode: "Num. iscrizione all'albo", chamberOfCommerce: "Camera di commercio", emails: "E-mail", password: "Password",
        description: "Descrizione", services: "Servizi offerti", segments: "Tratte coperte", areas: "Aree coperte", driver: 'Autista', drivers: 'Autisti', truck: 'Camion', trucks: 'Camions',
        trailer: 'Rimorchio', trailers: 'Rimorchi', clerks: 'Impiegati', changePassword: 'Cambia password', driversList: "Lista autisti", driverDetails: "Anagrafica autista", trucksList: 'Lista camions',
        list: "Lista", vehicleDetails: "Dettagli veicolo", clerksList: 'Lista impiegati', clerk: 'Impiegato', trailersList: 'Lista rimorchi', details:'Dettagli', username: 'Username',
        birthDate: 'Data di nascita', title: 'Titolo', text: 'Testo', loadImage: 'Carica immagine', attached: 'Allega', documents: 'Documenti', validityDate: 'Inizio validità', deadLine: 'Scadenza',
        returnToList: 'Torna alla lista', files: 'Files', filesToDownload: 'Files da scaricare', accept:'Accetta', sendRequest:'Invia richiesta', search: 'Cerca'
    },
    lan_en: {
        publicToYourContactsNetwork: 'Public to your contacts network', companyDetails: 'Company Details', invoiceNumber: 'Invoice number', rate: 'Rate', limit: 'Limit', goodsConfiscation: 'Goods Confisc.', vehicleConfiscation: 'Vehicle Confisc.',
        fiscalResponsibility: 'Fiscal Resp.', emas: 'Emas', validity: 'Validity', alert: 'Alert', grace: 'Grace', loadModel: 'Load model', attach: 'Attach', premium: 'Premium', medium: 'Medium',
        smart: 'Smart', for: 'For', euro: 'Euro', buyNow: 'Buy now!', amount: 'Amount', cardNumber: 'Card number', account: 'Account', general: 'General', postToYourLinks: 'Post to your links',
        submit: 'Submit', news: 'News', hideNotifications: 'Hide notifications', linksRequest: 'Links request', generals: 'Generals', admin: 'Admin', extra: 'Extra', send: 'Send',
        paymentDetails: 'Payment details', credits: 'Credits', orderHistory: 'Order history', buyCredits: 'Buy credits', document: 'document', hideLinkRequests: 'Hide link requests',
        showHideLinkRequests: 'Show hidden link requests...', resume: 'Resume', date: 'Date', close: 'Close', gracePeriod: 'Grace period', more: 'More', deadline: 'Deadline',
        value: 'Value', certificate: 'Certificate', download: 'Download', hide: 'Hide', note: 'Note', highlight: 'Highlight', showHideNotifications: 'Show hidden notifications...',
        linkRequests: 'Link requests', notifications: 'Notifications', save: 'Save', type: 'Type', edit: 'Edit', country: 'Country', logo: 'Logo', links: 'Links', new: 'New',
        return: 'Return', chassisNumber: 'Chassis number', registrationYear: 'Registration year', configuration: 'Configuration', category: 'Category', tare: 'Tare', certifier: 'Certifier',
        weight: 'Weight', model: 'Model', brand: 'Brand', view: 'View',goTo: 'Go to', delete: 'Delete', lastName: 'Last Name', firstName: 'First Name', curriculum: 'Curriculum',
        languages: 'Languages', skype: 'Skype', phone: 'Phone', patents: 'Patents', language: 'Language', english: 'English', italian: 'Italian', yourProfile: 'Your Profile', name: "Name",
        profile: "Profile", company: 'Company', transportListCode: "Transport List Code", chamberOfCommerce: "Chamber Of Commerce", emails: "E-mail", password: "Password", description: "Description",
        services: "Services", segments: "Segments", areas: "Areas", driver: 'Driver', drivers: 'Drivers', truck: 'Truck', trucks: 'Trucks', trailer: 'Trailer', trailers: 'Trailers', clerks: 'Clerks',
        changePassword: 'Change password', driversList: "Drivers list", driverDetails: "Driver details", trucksList: 'Trucks list', list: "List", vehicleDetails: 'Vehicle details', clerksList: 'Clerks list',
        clerk: 'Clerk', trailersList: 'Trailers list', details:'Details', username: 'Username', birthDate: 'Birth date', title: 'Title', text: 'Testo', loadImage: 'Load image', attached: 'Attached',
        documents: 'Documents', validityDate: 'Validity date', deadLine: 'DeadLine', template: 'Template', returnToList: 'Return to list', files: 'Files', accept:'Accept',
        filesToDownload: 'Files to download', sendRequest:'Send request', searchCompanies: 'Search companies', search: 'Search'
    },

    actions:{
//        /*     ***infinite scroll***     */
        getMore: function() {
            if (this.get('loadingMore')) { return; } // don't load new data if we already are
            this.set('loadingMore', true);

            this.get('target').send('getMore'); // pass this action up the chain to the events hash on the route
        },

        gotMore: function(items, page) {
            this.set('loadingMore', false);
            this.set('page', page);
            //this.pushObjects(items);
        },

        /*     ***logout***     */
        logout: function(){
            this.set('grantsValue', null);
            this.set('user_record', null);
            this.set('userId', null);
            this.set('token', null);
            this.app_init.set('token', this.token);
            this.set('username', null);
            this.set('selectedDepot', null);
            this.set('userProfile', null);
            this.set('company', null);
            this.set('companyType', null);
            this.set('isAdmin', null);

            localStorage.removeItem('user_record');
            localStorage.removeItem('grantsValue');
            localStorage.removeItem('userId');
            localStorage.removeItem('token');
            localStorage.removeItem('username');
            localStorage.removeItem('selectedDepot');
            localStorage.removeItem('userProfile');
            localStorage.removeItem('company');
            localStorage.removeItem('companyType');
            localStorage.removeItem('isAdmin');

            localStorage.clear();

            this.transitionToRoute('login/main');
        }
    },


    /*****************************
     * NATIONS
     */
    nations_name: [
        'Afganistan', 'Aland Islands', 'Albania', 'Algeria', 'American Samoa', 'Andorra', 'Angola', 'Anguilla', 'Antigua & Barbuda', 'Argentina', 'Armenia', 'Aruba', 'Australia', 'Austria',
        'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bermuda', 'Bhutan', 'Bolivia', 'Bonaire','Bosnia-Herzegovina','Botswana',
        'Brazil','British Indian Ocean Territory','British Virgin Islands','Brunei Darussalam','Bulgaria','Burkina Faso','Burundi','Cambodia','Cameroon','Canada',
        'Cape Verde Islands','Cayman Islands','Central African Republic','Chile','China','Christmas Island','Cocos (Keeling) Islands','Colombia','Comoros','Congo (Brazzaville)',
        'Congo (Kinshasa)','Cook Islands','Costa Rica','Croatia','Cuba','Curaçao','Cyprus','Czech Republic','Denmark','Djibouti','Dominica','Dominican Republic','East Timor','Ecuador',
        'Egypt','El Salvador','Equatorial Guinea','Eritrea','Estonia','Ethiopia','Faeroe Islands','Falkland Islands','Fiji','Finland','France','French Guiana','French Polynesia',
        'French Southern Territories','Gabon','Gambia','Georgia','Germany','Ghana','Gibralter','Greece','Greenland','Grenada','Guadeloupe','Guam','Guatemala','Guernsey','Guinea',
        'Guinea-Bissau','Guyana','Haiti','Holy See','Honduras','Hong Kong','Hungary','Iceland','India','Indonesia','Iran','Iraq','Ireland','Isle of Man','Israel','Italy','Ivory Coast',
        'Jamaica','Japan','Jersey','Jordan','Kazakhstan','Kenya','Kiribati','Kosovo','Kuwait','Kyrgyzstan','Laos','Latvia','Lebanon','Lesotho','Liberia','Libya','Liechtenstein',
        'Lithuania','Luxembourg','Macau','Macedonia','Madagascar','Malawi','Malaysia','Maldives','Mali','Malta','Marshall Islands','Martinique','Mauritania','Mauritius','Mayotte','Mexico',
        'Micronesia','Moldova','Monaco','Mongolia','Montenegro','Montserrat','Morocco','Mozambique','Myanmar','Namibia','Nauru','Nepal','Netherlands Antilles','Netherlands','New Caledonia',
        'New Zealand','Nicaragua','Niger','Nigeria','Niue','Norfolk Island','North Korea','Northern Mariana Islands','Norway','Oman','Pakistan','Palau','Palestinian Territories','Panama',
        'Papua New Guinea','Paraguay','Peru','Philippines','Pitcairn Islands','Poland','Portugal','Puerto Rico','Qatar','Romania','Russia','Rwanda','Réunion','Saba','Saint Barthélemy',
        'Saint Christopher & Nevis','Saint Helena','Saint Lucia','Saint Martin','Saint Pierre & Miquelon','Saint Vincent & The Grenadines','Samoa','San Marino','Sao Tome & Principe',
        'Saudi Arabia','Senegal','Serbia','Seychelles','Sierra Leone','Singapore','Sint Eustatius','Sint Maarten','Slovakia','Slovenia','Solomon Islands','Somalia','South Africa',
        'South Georgia & The South Sandwish Islands','South Sudan','Spain','Sri Lanka','Sudan','Suriname','Swaziland','Sweden','Switzerland','Syria','Taiwan','Tajikistan','Thailand','Togo',
        'Tokelau','Tonga','Trinidad & Tobago','Tunisia','Turkey','Turkmenistan','Turks & Caicos Islands','Tuvalu','Uganda','Ukraine','United Arab Emirates','United Kingdom','United States',
        'United States Virgin Islands','Uruguay','Uzbekistan','Vanuatu','Venezuela','Vietnam','Wallis & Futuna','Western Sahara','Yemen','Zambia','Zimbabwe'
    ],


    nations: Ember.A([
            {
                id: 1,
                euname: "AFGHANISTAN",
                iso3: "AFG",
                iso2: "AF",
                grc: "AFG",
                isonum: "4",
                country: "Afganistan"
            },
            {
                id: 2,
                "linked_country": "Finland",
                "iso3": "ALA",
                "iso2": "AX",
                "grc": "ALA",
                "isonum": "248",
                "country": "Aland Islands",
                "imperitive": "Postal"
            },
            {
                id: 3,
                "euname": "Albania",
                "iso3": "ALB",
                "iso2": "AL",
                "grc": "ALB",
                "isonum": "8",
                "country": "Albania"
            },
            {
                id: 4,
                "euname": "ALGERIA",
                "iso3": "DZA",
                "iso2": "DZ",
                "grc": "ALG",
                "isonum": "12",
                "country": "Algeria"
            },
            {
                id: 5,
                "linked_country": "United States of America",
                "iso3": "ASM",
                "iso2": "AS",
                "grc": "AMS",
                "isonum": "16",
                "country": "American Samoa",
                "imperitive": "Geographical"
            },
            {
                id: 6,
                "euname": "ANDORRA",
                "iso3": "AND",
                "iso2": "AD",
                "grc": "AND",
                "isonum": "20",
                "country": "Andorra"
            },
            {
                id: 7,
                "euname": "ANGOLA",
                "iso3": "AGO",
                "iso2": "AO",
                "grc": "ANG",
                "isonum": "24",
                "country": "Angola"
            },
            {
                id: 8,
                "linked_country": "United Kingdom",
                "iso3": "AIA",
                "iso2": "AI",
                "grc": "ANU",
                "isonum": "660",
                "country": "Anguilla",
                "imperitive": "Geographical; Postal; Currency; Telephone"
            },
            {
                id: 9,
                "euname": "ANTIGUA AND BARBUDA",
                "iso3": "ATG",
                "iso2": "AG",
                "grc": "ANT",
                "isonum": "28",
                "country": "Antigua & Barbuda"
            },
            {
                id: 10,
                "euname": "Argentina",
                "iso3": "ARG",
                "iso2": "AR",
                "grc": "ARG",
                "isonum": "32",
                "country": "Argentina"
            },
            {
                id: 11,
                "euname": "Armenia",
                "iso3": "ARM",
                "iso2": "AM",
                "grc": "ARM",
                "isonum": "51",
                "country": "Armenia"
            },
            {
                id: 12,
                "euname": "ARUBA",
                "linked_country": "Netherlands",
                "iso3": "ABW",
                "iso2": "AW",
                "grc": "ARU",
                "isonum": "533",
                "country": "Aruba",
                "imperitive": "Geographical; Postal; Currency; Telephone"
            },
            {
                id: 13,
                "euname": "Australia",
                "iso3": "AUS",
                "iso2": "AU",
                "grc": "AST",
                "isonum": "36",
                "country": "Australia"
            },
            {
                id: 14,
                "euname": "Austria",
                "iso3": "AUT",
                "iso2": "AT",
                "grc": "AUS",
                "isonum": "40",
                "country": "Austria"
            },
            {
                id: 15,
                "euname": "AZERBAIJAN",
                "iso3": "AZE",
                "iso2": "AZ",
                "grc": "AZE",
                "isonum": "31",
                "country": "Azerbaijan"
            },
            {
                id: 16,
                "euname": "BAHAMAS",
                "iso3": "BHS",
                "iso2": "BS",
                "grc": "BAH",
                "isonum": "44",
                "country": "Bahamas"
            },
            {
                id: 17,
                "euname": "BAHRAIN",
                "iso3": "BHR",
                "iso2": "BH",
                "grc": "BAR",
                "isonum": "48",
                "country": "Bahrain"
            },
            {
                id: 18,
                "euname": "BANGLADESH",
                "iso3": "BGD",
                "iso2": "BD",
                "grc": "BAN",
                "isonum": "50",
                "country": "Bangladesh"
            },
            {
                id: 19,
                "euname": "Barbados",
                "iso3": "BRB",
                "iso2": "BB",
                "grc": "BAB",
                "isonum": "52",
                "country": "Barbados"
            },
            {
                id: 20,
                "euname": "BELARUS",
                "iso3": "BLR",
                "iso2": "BY",
                "grc": "BEO",
                "isonum": "112",
                "country": "Belarus"
            },
            {
                id: 21,
                "euname": "Belgium",
                "iso3": "BEL",
                "iso2": "BE",
                "grc": "BEL",
                "isonum": "56",
                "country": "Belgium"
            },
            {
                id: 22,
                "euname": "BELIZE",
                "iso3": "BLZ",
                "iso2": "BZ",
                "grc": "BEI",
                "isonum": "84",
                "country": "Belize"
            },
            {
                id: 23,
                "euname": "Benin",
                "iso3": "BEN",
                "iso2": "BJ",
                "grc": "BEN",
                "isonum": "204",
                "country": "Benin"
            },
            {
                id: 24,
                "linked_country": "United Kingdom",
                "iso3": "BMU",
                "iso2": "BM",
                "grc": "BER",
                "isonum": "60",
                "country": "Bermuda",
                "imperitive": "Geographical; Postal; Currency; Telephone"
            },
            {
                id: 25,
                "euname": "BHUTAN",
                "iso3": "BTN",
                "iso2": "BT",
                "grc": "BHU",
                "isonum": "64",
                "country": "Bhutan"
            },
            {
                id: 26,
                "euname": "BOLIVIA",
                "iso3": "BOL",
                "iso2": "BO",
                "grc": "BOL",
                "isonum": "68",
                "country": "Bolivia"
            },
            {
                id: 27,
                "linked_country": "Netherlands",
                "iso3": "BES",
                "iso2": "BQ",
                "grc": "BON",
                "isonum": "535",
                "country": "Bonaire",
                "imperitive": "Geographical; Postal; Currency; Telephone"
            },
            {
                id: 28,
                "euname": "Bosnia-Herzegovina",
                "iso3": "BIH",
                "iso2": "BA",
                "grc": "BOS",
                "isonum": "70",
                "country": "Bosnia-Herzegovina"
            },
            {
                id: 29,
                "euname": "BOTSWANA",
                "iso3": "BWA",
                "iso2": "BW",
                "grc": "BOT",
                "isonum": "72",
                "country": "Botswana"
            },
            {
                id: 30,
                "euname": "Brazil",
                "iso3": "BRA",
                "iso2": "BR",
                "grc": "BRA",
                "isonum": "76",
                "country": "Brazil"
            },
            {
                id: 31,
                "linked_country": "United Kingdom, United States of America",
                "iso3": "IOT",
                "iso2": "IO",
                "grc": "BIO",
                "isonum": "86",
                "country": "British Indian Ocean Territory",
                "imperitive": "Geographical; Postal; Telephone"
            },
            {
                id: 32,
                "euname": "British Virgin Islands",
                "linked_country": "United Kingdom",
                "iso3": "VGB",
                "iso2": "VG",
                "grc": "BVI",
                "isonum": "92",
                "country": "British Virgin Islands",
                "imperitive": "Geographical; Postal; Currency; Telephone"
            },
            {
                id: 33,
                "euname": "BRUNEI",
                "iso3": "BRN",
                "iso2": "BN",
                "grc": "BRU",
                "isonum": "96",
                "country": "Brunei Darussalam"
            },
            {
                id: 34,
                "euname": "Bulgaria",
                "iso3": "BGR",
                "iso2": "BG",
                "grc": "BUL",
                "isonum": "100",
                "country": "Bulgaria"
            },
            {
                id: 35,
                "euname": "BURKINA FASO",
                "iso3": "BFA",
                "iso2": "BF",
                "grc": "BUK",
                "isonum": "854",
                "country": "Burkina Faso"
            },
            {
                id: 36,
                "euname": "BURUNDI",
                "iso3": "BDI",
                "iso2": "BI",
                "grc": "BUU",
                "isonum": "108",
                "country": "Burundi"
            },
            {
                id: 37,
                "euname": "Cambodia",
                "iso3": "KHM",
                "iso2": "KH",
                "grc": "CAM",
                "isonum": "116",
                "country": "Cambodia"
            },
            {
                id: 38,
                "euname": "Cameroon",
                "iso3": "CMR",
                "iso2": "CM",
                "grc": "CAE",
                "isonum": "120",
                "country": "Cameroon"
            },
            {
                id: 39,
                "euname": "Canada",
                "iso3": "CAN",
                "iso2": "CA",
                "grc": "CAN",
                "isonum": "124",
                "country": "Canada"
            },
            {
                id: 40,
                "euname": "CAPE VERDE",
                "iso3": "CPV",
                "iso2": "CV",
                "grc": "CAP",
                "isonum": "132",
                "country": "Cape Verde Islands"
            },
            {
                id: 41,
                "linked_country": "United Kingdom",
                "iso3": "CYM",
                "iso2": "KY",
                "grc": "CAY",
                "isonum": "136",
                "country": "Cayman Islands",
                "imperitive": "Geographical; Postal; Currency; Telephone"
            },
            {
                id: 42,
                "euname": "CENTRAL AFRICAN, REPUBLIC",
                "iso3": "CAF",
                "iso2": "CF",
                "grc": "CEN",
                "isonum": "140",
                "country": "Central African Republic"
            },
            {
                id: 43,
                "euname": "Chad",
                "iso3": "TCD",
                "iso2": "TD",
                "grc": "CHA",
                "isonum": "148",
                "country": "Chad"
            },
            {
                id: 44,
                "euname": "CHILE",
                "iso3": "CHL",
                "iso2": "CL",
                "grc": "CHI",
                "isonum": "152",
                "country": "Chile"
            },
            {
                id: 45,
                "euname": "CHINA",
                "iso3": "CHN",
                "iso2": "CN",
                "grc": "CHN",
                "isonum": "156",
                "country": "China"
            },
            {
                id: 46,
                "linked_country": "Australia",
                "iso3": "CXR",
                "iso2": "CX",
                "grc": "CHR",
                "isonum": "162",
                "country": "Christmas Island",
                "imperitive": "Geographical"
            },
            {
                id: 47,
                "linked_country": "Australia",
                "iso3": "CCK",
                "iso2": "CC",
                "grc": "COC",
                "isonum": "166",
                "country": "Cocos (Keeling) Islands",
                "imperitive": "Geographical"
            },
            {
                id: 48,
                "euname": "Colombia",
                "iso3": "COL",
                "iso2": "CO",
                "grc": "CLO",
                "isonum": "170",
                "country": "Colombia"
            },
            {
                id: 49,
                "euname": "COMOROS",
                "iso3": "COM",
                "iso2": "KM",
                "grc": "COM",
                "isonum": "174",
                "country": "Comoros"
            },
            {
                id: 50,
                "euname": "CONGO",
                "iso3": "COG",
                "iso2": "CG",
                "grc": "CNG",
                "isonum": "178",
                "country": "Congo (Brazzaville)"
            },
            {
                id: 51,
                "euname": "CONGO, DEMOCRATIC REPUBLIC OF",
                "iso3": "ZAR",
                "iso2": "CD",
                "grc": "ZAI",
                "isonum": "180",
                "country": "Congo (Kinshasa)"
            },
            {
                id: 52,
                "euname": "COOK ISLANDS",
                "linked_country": "New Zealand",
                "iso3": "COK",
                "iso2": "CK",
                "grc": "COO",
                "isonum": "184",
                "country": "Cook Islands",
                "imperitive": "Geographical; Postal; Telephone"
            },
            {
                id: 53,
                "euname": "Costa Rica",
                "iso3": "CRI",
                "iso2": "CR",
                "grc": "COS",
                "isonum": "188",
                "country": "Costa Rica"
            },
            {
                id: 54,
                "euname": "Croatia",
                "iso3": "HRV",
                "iso2": "HR",
                "grc": "CRO",
                "isonum": "191",
                "country": "Croatia"
            },
            {
                id: 55,
                "euname": "CUBA",
                "iso3": "CUB",
                "iso2": "CU",
                "grc": "CUB",
                "isonum": "192",
                "country": "Cuba"
            },
            {
                id: 56,
                "linked_country": "Netherlands",
                "iso3": "CUW",
                "iso2": "CW",
                "grc": "CUR",
                "isonum": "531",
                "country": "Curaçao",
                "imperitive": "Geographical; Postal; Currency; Telephone"
            },
            {
                id: 57,
                "euname": "Cyprus",
                "iso3": "CYP",
                "iso2": "CY",
                "grc": "CYP",
                "isonum": "196",
                "country": "Cyprus"
            },
            {
                id: 58,
                "euname": "Czech Republic",
                "iso3": "CZE",
                "iso2": "CZ",
                "grc": "CZE",
                "isonum": "203",
                "country": "Czech Republic"
            },
            {
                id: 59,
                "euname": "Denmark",
                "iso3": "DNK",
                "iso2": "DK",
                "grc": "DEN",
                "isonum": "208",
                "country": "Denmark"
            },
            {
                id: 60,
                "euname": "DJIBOUTI",
                "iso3": "DJI",
                "iso2": "DJ",
                "grc": "DJI",
                "isonum": "262",
                "country": "Djibouti"
            },
            {
                id: 61,
                "euname": "DOMINIQUE",
                "iso3": "DMA",
                "iso2": "DM",
                "grc": "DOI",
                "isonum": "212",
                "country": "Dominica"
            },
            {
                id: 62,
                "euname": "Dominican Republic",
                "iso3": "DOM",
                "iso2": "DO",
                "grc": "DOM",
                "isonum": "214",
                "country": "Dominican Republic"
            },
            {
                id: 63,
                "euname": "EAST TIMOR",
                "iso3": "TLS",
                "iso2": "TL",
                "grc": "ETI",
                "isonum": "626",
                "country": "East Timor"
            },
            {
                id: 64,
                "euname": "Ecuador",
                "iso3": "ECU",
                "iso2": "EC",
                "grc": "ECU",
                "isonum": "218",
                "country": "Ecuador"
            },
            {
                id: 65,
                "euname": "EGYPT",
                "iso3": "EGY",
                "iso2": "EG",
                "grc": "EGY",
                "isonum": "818",
                "country": "Egypt"
            },
            {
                id: 66,
                "euname": "El Salvador",
                "iso3": "SLV",
                "iso2": "SV",
                "grc": "ELS",
                "isonum": "222",
                "country": "El Salvador"
            },
            {
                id: 67,
                "euname": "EQUATORIAL GUINEA",
                "iso3": "GNQ",
                "iso2": "GQ",
                "grc": "EQA",
                "isonum": "226",
                "country": "Equatorial Guinea"
            },
            {
                id: 68,
                "euname": "ERITREA",
                "iso3": "ERI",
                "iso2": "ER",
                "grc": "ERI",
                "isonum": "232",
                "country": "Eritrea"
            },
            {
                id: 69,
                "euname": "Estonia",
                "iso3": "EST",
                "iso2": "EE",
                "grc": "EST",
                "isonum": "233",
                "country": "Estonia"
            },
            {
                id: 70,
                "euname": "ETHIOPIA",
                "iso3": "ETH",
                "iso2": "ET",
                "grc": "ETH",
                "isonum": "231",
                "country": "Ethiopia"
            },
            {
                id: 71,
                "euname": "FAROE ISLANDS",
                "iso3": "FRO",
                "iso2": "FO",
                "grc": "FAE",
                "isonum": "234",
                "country": "Faeroe Islands"
            },
            {
                id: 72,
                "linked_country": "United Kingdom",
                "iso3": "FLK",
                "iso2": "FK",
                "grc": "FAL",
                "isonum": "238",
                "country": "Falkland Islands",
                "imperitive": "Geographical; Postal; Currency; Telephone"
            },
            {
                id: 73,
                "euname": "FIJI",
                "iso3": "FJI",
                "iso2": "FJ",
                "grc": "FIJ",
                "isonum": "242",
                "country": "Fiji"
            },
            {
                id: 74,
                "euname": "Finland",
                "iso3": "FIN",
                "iso2": "FI",
                "grc": "FIN",
                "isonum": "246",
                "country": "Finland"
            },
            {
                id: 75,
                "euname": "France",
                "iso3": "FRA",
                "iso2": "FR",
                "grc": "FRA",
                "isonum": "250",
                "country": "France"
            },
            {
                id: 76,
                "euname": "FRENCH GUYANA",
                "linked_country": "France",
                "iso3": "GUF",
                "iso2": "GF",
                "grc": "FGU",
                "isonum": "254",
                "country": "French Guiana",
                "imperitive": "Geographical; Telephone"
            },
            {
                id: 77,
                "euname": "FRENCH POLYNESIA",
                "linked_country": "France",
                "iso3": "PYF",
                "iso2": "PF",
                "grc": "FPO",
                "isonum": "258",
                "country": "French Polynesia",
                "imperitive": "Geographical; Currency; Telephone"
            },
            {
                id: 78,
                "linked_country": "France",
                "iso3": "ATF",
                "iso2": "TF",
                "grc": "FST",
                "isonum": "260",
                "country": "French Southern Territories",
                "imperitive": "Geographical; Postal; Telephone"
            },
            {
                id: 79,
                "euname": "GABON",
                "iso3": "GAB",
                "iso2": "GA",
                "grc": "GAB",
                "isonum": "266",
                "country": "Gabon"
            },
            {
                id: 80,
                "euname": "GAMBIA",
                "iso3": "GMB",
                "iso2": "GM",
                "grc": "GAM",
                "isonum": "270",
                "country": "Gambia"
            },
            {
                id: 81,
                "euname": "GEORGIA",
                "iso3": "GEO",
                "iso2": "GE",
                "grc": "GEO",
                "isonum": "268",
                "country": "Georgia"
            },
            {
                id: 82,
                "euname": "Germany",
                "iso3": "DEU",
                "iso2": "DE",
                "grc": "GER",
                "isonum": "276",
                "country": "Germany"
            },
            {
                id: 83,
                "euname": "Ghana",
                "iso3": "GHA",
                "iso2": "GH",
                "grc": "GHA",
                "isonum": "288",
                "country": "Ghana"
            },
            {
                id: 84,
                "euname": "GIBRALTAR",
                "linked_country": "United Kingdom",
                "iso3": "GIB",
                "iso2": "GI",
                "grc": "GIB",
                "isonum": "292",
                "country": "Gibralter",
                "imperitive": "Geographical; Postal; Currency; Telephone"
            },
            {
                id: 85,
                "euname": "Greece",
                "iso3": "GRC",
                "iso2": "GR",
                "grc": "GRE",
                "isonum": "300",
                "country": "Greece"
            },
            {
                id: 86,
                "euname": "GREENLAND",
                "linked_country": "Denmark",
                "iso3": "GRL",
                "iso2": "GL",
                "grc": "GRN",
                "isonum": "304",
                "country": "Greenland",
                "imperitive": "Geographical; Postal; Telephone"
            },
            {
                id: 87,
                "euname": "GRENADA",
                "iso3": "GRD",
                "iso2": "GD",
                "grc": "GRA",
                "isonum": "308",
                "country": "Grenada"
            },
            {
                id: 88,
                "euname": "GUADELOUPE",
                "linked_country": "France",
                "iso3": "GLP",
                "iso2": "GP",
                "grc": "GUD",
                "isonum": "312",
                "country": "Guadeloupe",
                "imperitive": "Geographical; Postal; Telephone"
            },
            {
                id: 89,
                "linked_country": "United States of America",
                "iso3": "GUM",
                "iso2": "GU",
                "grc": "GUM",
                "isonum": "316",
                "country": "Guam",
                "imperitive": "Geographical"
            },
            {
                id: 90,
                "euname": "Guatemala",
                "iso3": "GTM",
                "iso2": "GT",
                "grc": "GUA",
                "isonum": "320",
                "country": "Guatemala"
            },
            {
                id: 91,
                "linked_country": "United Kingdom",
                "iso3": "GGY",
                "iso2": "GG",
                "grc": "GUE",
                "isonum": "831",
                "country": "Guernsey",
                "imperitive": "Postal"
            },
            {
                id: 92,
                "euname": "Guinea",
                "iso3": "GIN",
                "iso2": "GN",
                "grc": "GUI",
                "isonum": "324",
                "country": "Guinea"
            },
            {
                id: 93,
                "euname": "GUINEA BISSAU",
                "iso3": "GNB",
                "iso2": "GW",
                "grc": "GUB",
                "isonum": "624",
                "country": "Guinea-Bissau"
            },
            {
                id: 94,
                "euname": "GUYANA",
                "iso3": "GUY",
                "iso2": "GY",
                "grc": "GUY",
                "isonum": "328",
                "country": "Guyana"
            },
            {
                id: 95,
                "euname": "HAITI",
                "iso3": "HTI",
                "iso2": "HT",
                "grc": "HAI",
                "isonum": "332",
                "country": "Haiti"
            },
            {
                id: 96,
                "euname": "HOLY SEE (VATICAN CITY STATE)",
                "iso3": "VAT",
                "iso2": "VA",
                "grc": "VAT",
                "isonum": "336",
                "country": "Holy See"
            },
            {
                id: 97,
                "euname": "Honduras",
                "iso3": "HND",
                "iso2": "HN",
                "grc": "HON",
                "isonum": "340",
                "country": "Honduras"
            },
            {
                id: 98,
                "euname": "Hong Kong",
                "linked_country": "China",
                "iso3": "HKG",
                "iso2": "HK",
                "grc": "HOK",
                "isonum": "344",
                "country": "Hong Kong",
                "imperitive": "Postal; Currency; Telephone"
            },
            {
                id: 99,
                "euname": "Hungary",
                "iso3": "HUN",
                "iso2": "HU",
                "grc": "HUN",
                "isonum": "348",
                "country": "Hungary"
            },
            {
                id: 100,
                "euname": "Iceland",
                "iso3": "ISL",
                "iso2": "IS",
                "grc": "ICE",
                "isonum": "352",
                "country": "Iceland"
            },
            {
                id: 101,
                "euname": "India",
                "iso3": "IND",
                "iso2": "IN",
                "grc": "IND",
                "isonum": "356",
                "country": "India"
            },
            {
                id: 102,
                "euname": "INDONESIA",
                "iso3": "IDN",
                "iso2": "ID",
                "grc": "INO",
                "isonum": "360",
                "country": "Indonesia"
            },
            {
                id: 103,
                "euname": "IRAN, ISLAMIC REPUBLIC OF",
                "iso3": "IRN",
                "iso2": "IR",
                "grc": "IRA",
                "isonum": "364",
                "country": "Iran"
            },
            {
                id: 104,
                "euname": "IRAQ",
                "iso3": "IRQ",
                "iso2": "IQ",
                "grc": "IRQ",
                "isonum": "368",
                "country": "Iraq"
            },
            {
                id: 105,
                "euname": "Ireland",
                "iso3": "IRL",
                "iso2": "IE",
                "grc": "IRE",
                "isonum": "372",
                "country": "Ireland"
            },
            {
                id: 106,
                "linked_country": "United Kingdom",
                "iso3": "IMN",
                "iso2": "IM",
                "grc": "ISL",
                "isonum": "833",
                "country": "Isle of Man",
                "imperitive": "Postal"
            },
            {
                id: 107,
                "euname": "Israel",
                "iso3": "ISR",
                "iso2": "IL",
                "grc": "ISR",
                "isonum": "376",
                "country": "Israel"
            },
            {
                id: 108,
                "euname": "Italy",
                "iso3": "ITA",
                "iso2": "IT",
                "grc": "ITA",
                "isonum": "380",
                "country": "Italy"
            },
            {
                id: 109,
                "euname": "COTE D'IVOIRE",
                "iso3": "CIV",
                "iso2": "CI",
                "grc": "IVO",
                "isonum": "384",
                "country": "Ivory Coast"
            },
            {
                id: 110,
                "euname": "Jamaica",
                "iso3": "JAM",
                "iso2": "JM",
                "grc": "JAM",
                "isonum": "388",
                "country": "Jamaica"
            },
            {
                id: 111,
                "euname": "Japan",
                "iso3": "JPN",
                "iso2": "JP",
                "grc": "JAP",
                "isonum": "392",
                "country": "Japan"
            },
            {
                id: 112,
                "euname": "JERSEY",
                "linked_country": "United Kingdom",
                "iso3": "JEY",
                "iso2": "JE",
                "grc": "JER",
                "isonum": "832",
                "country": "Jersey",
                "imperitive": "Postal"
            },
            {
                id: 113,
                "euname": "JORDAN",
                "iso3": "JOR",
                "iso2": "JO",
                "grc": "JOR",
                "isonum": "400",
                "country": "Jordan"
            },
            {
                id: 114,
                "euname": "KAZAKHSTAN",
                "iso3": "KAZ",
                "iso2": "KZ",
                "grc": "KAZ",
                "isonum": "398",
                "country": "Kazakhstan"
            },
            {
                id: 115,
                "euname": "Kenya",
                "iso3": "KEN",
                "iso2": "KE",
                "grc": "KEN",
                "isonum": "404",
                "country": "Kenya"
            },
            {
                id: 116,
                "euname": "KIRIBATI",
                "iso3": "KIR",
                "iso2": "KI",
                "grc": "KII",
                "isonum": "296",
                "country": "Kiribati"
            },
            {
                id: 117,
                "linked_country": "Serbia",
                "iso3": "KOS",
                "grc": "KOS",
                "country": "Kosovo",
                "imperitive": "Postal; Currency; Telephone"
            },
            {
                id: 118,
                "euname": "KUWAIT",
                "iso3": "KWT",
                "iso2": "KW",
                "grc": "KUW",
                "isonum": "414",
                "country": "Kuwait"
            },
            {
                id: 119,
                "euname": "KYRGYZSTAN",
                "iso3": "KGZ",
                "iso2": "KG",
                "grc": "KIR",
                "isonum": "417",
                "country": "Kyrgyzstan"
            },
            {
                id: 120,
                "euname": "LAOS, PEOPLE'S DEMOCRATIC REPUBLIC",
                "iso3": "LAO",
                "iso2": "LA",
                "grc": "LAO",
                "isonum": "418",
                "country": "Laos"
            },
            {
                id: 121,
                "euname": "Latvia",
                "iso3": "LVA",
                "iso2": "LV",
                "grc": "LAT",
                "isonum": "428",
                "country": "Latvia"
            },
            {
                id: 122,
                "euname": "LEBANON",
                "iso3": "LBN",
                "iso2": "LB",
                "grc": "LEB",
                "isonum": "422",
                "country": "Lebanon"
            },
            {
                id: 123,
                "euname": "LESOTHO",
                "iso3": "LSO",
                "iso2": "LS",
                "grc": "LES",
                "isonum": "426",
                "country": "Lesotho"
            },
            {
                id: 124,
                "euname": "LIBERIA",
                "iso3": "LBR",
                "iso2": "LR",
                "grc": "LIR",
                "isonum": "430",
                "country": "Liberia"
            },
            {
                id: 125,
                "euname": "LIBYA",
                "iso3": "LBY",
                "iso2": "LY",
                "grc": "LIB",
                "isonum": "434",
                "country": "Libya"
            },
            {
                id: 126,
                "euname": "LIECHTENSTEIN",
                "iso3": "LIE",
                "iso2": "LI",
                "grc": "LIE",
                "isonum": "438",
                "country": "Liechtenstein"
            },
            {
                id: 127,
                "euname": "LITUANIA",
                "iso3": "LTU",
                "iso2": "LT",
                "grc": "LIT",
                "isonum": "440",
                "country": "Lithuania"
            },
            {
                id: 128,
                "euname": "Luxembourg",
                "iso3": "LUX",
                "iso2": "LU",
                "grc": "LUX",
                "isonum": "442",
                "country": "Luxembourg"
            },
            {
                id: 129,
                "euname": "MACAO",
                "linked_country": "China",
                "iso3": "MAC",
                "iso2": "MO",
                "grc": "MCA",
                "isonum": "446",
                "country": "Macau",
                "imperitive": "Postal; Currency; Telephone"
            },
            {
                id: 130,
                "euname": "MACEDONIA, FORMER YUGOSLAV REPUBLIC OF",
                "iso3": "MKD",
                "iso2": "MK",
                "grc": "MCE",
                "isonum": "807",
                "country": "Macedonia"
            },
            {
                id: 131,
                "euname": "MADAGASCAR",
                "iso3": "MDG",
                "iso2": "MG",
                "grc": "MAD",
                "isonum": "450",
                "country": "Madagascar"
            },
            {
                id: 132,
                "euname": "MALAWI",
                "iso3": "MWI",
                "iso2": "MW",
                "grc": "MAW",
                "isonum": "454",
                "country": "Malawi"
            },
            {
                id: 133,
                "euname": "Malaysia",
                "iso3": "MYS",
                "iso2": "MY",
                "grc": "MAA",
                "isonum": "458",
                "country": "Malaysia"
            },
            {
                id: 134,
                "euname": "MALDIVES",
                "iso3": "MDV",
                "iso2": "MV",
                "grc": "MAV",
                "isonum": "462",
                "country": "Maldives"
            },
            {
                id: 135,
                "euname": "MALI",
                "iso3": "MLI",
                "iso2": "ML",
                "grc": "MAI",
                "isonum": "466",
                "country": "Mali"
            },
            {
                id: 136,
                "euname": "Malta",
                "iso3": "MLT",
                "iso2": "MT",
                "grc": "MAL",
                "isonum": "470",
                "country": "Malta"
            },
            {
                id: 137,
                "euname": "MARSHALL ISLANDS",
                "iso3": "MHL",
                "iso2": "MH",
                "grc": "MAR",
                "isonum": "584",
                "country": "Marshall Islands"
            },
            {
                id: 138,
                "euname": "MARTINIQUE",
                "linked_country": "France",
                "iso3": "MTQ",
                "iso2": "MQ",
                "grc": "MAN",
                "isonum": "474",
                "country": "Martinique",
                "imperitive": "Geographical; Postal; Telephone"
            },
            {
                id: 139,
                "euname": "Mauritania",
                "iso3": "MRT",
                "iso2": "MR",
                "grc": "MAU",
                "isonum": "478",
                "country": "Mauritania"
            },
            {
                id: 140,
                "euname": "MAURITIUS",
                "iso3": "MUS",
                "iso2": "MU",
                "grc": "MAT",
                "isonum": "480",
                "country": "Mauritius"
            },
            {
                id: 141,
                "euname": "MAYOTTE",
                "linked_country": "France",
                "iso3": "MYT",
                "iso2": "YT",
                "grc": "MAY",
                "isonum": "175",
                "country": "Mayotte",
                "imperitive": "Geographical; Postal; Telephone"
            },
            {
                id: 142,
                "euname": "Mexico",
                "iso3": "MEX",
                "iso2": "MX",
                "grc": "MEX",
                "isonum": "484",
                "country": "Mexico"
            },
            {
                id: 143,
                "euname": "MICRONESIA, FEDERATED STATES OF",
                "iso3": "FSM",
                "iso2": "FM",
                "grc": "MIC",
                "isonum": "583",
                "country": "Micronesia"
            },
            {
                id: 144,
                "euname": "MOLDOVA, REPUBLIC OF",
                "iso3": "MDA",
                "iso2": "MD",
                "grc": "MOL",
                "isonum": "498",
                "country": "Moldova"
            },
            {
                id: 145,
                "euname": "Monaco",
                "iso3": "MCO",
                "iso2": "MC",
                "grc": "MON",
                "isonum": "492",
                "country": "Monaco"
            },
            {
                id: 146,
                "euname": "MONGOLIA",
                "iso3": "MNG",
                "iso2": "MN",
                "grc": "MOG",
                "isonum": "496",
                "country": "Mongolia"
            },
            {
                id: 147,
                "euname": "Montenegro",
                "iso3": "MNE",
                "iso2": "ME",
                "grc": "MOE",
                "isonum": "499",
                "country": "Montenegro"
            },
            {
                id: 148,
                "linked_country": "United Kingdom",
                "iso3": "MSR",
                "iso2": "MS",
                "grc": "MOT",
                "isonum": "500",
                "country": "Montserrat",
                "imperitive": "Geographical; Postal; Currency; Telephone"
            },
            {
                id: 149,
                "euname": "Morocco",
                "iso3": "MAR",
                "iso2": "MA",
                "grc": "MOR",
                "isonum": "504",
                "country": "Morocco"
            },
            {
                id: 150,
                "euname": "Mozambique",
                "iso3": "MOZ",
                "iso2": "MZ",
                "grc": "MOZ",
                "isonum": "508",
                "country": "Mozambique"
            },
            {
                id: 151,
                "euname": "Myanmar",
                "iso3": "MMR",
                "iso2": "MM",
                "grc": "BUR",
                "isonum": "104",
                "country": "Myanmar"
            },
            {
                id: 152,
                "euname": "NAMIBIA",
                "iso3": "NAM",
                "iso2": "NA",
                "grc": "NAM",
                "isonum": "516",
                "country": "Namibia"
            },
            {
                id: 153,
                "euname": "NAURU",
                "iso3": "NRU",
                "iso2": "NR",
                "grc": "NAU",
                "isonum": "520",
                "country": "Nauru"
            },
            {
                id: 154,
                "euname": "NEPAL",
                "iso3": "NPL",
                "iso2": "NP",
                "grc": "NEP",
                "isonum": "524",
                "country": "Nepal"
            },
            {
                id: 155,
                "euname": "Netherlands Antilles",
                "iso3": "ANT",
                "iso2": "AN",
                "grc": "NAN",
                "isonum": "530",
                "country": "Netherlands Antilles",
                "imperitive": "Legacy"
            },
            {
                id: 156,
                "euname": "Netherlands",
                "iso3": "NLD",
                "iso2": "NL",
                "grc": "NET",
                "isonum": "528",
                "country": "Netherlands"
            },
            {
                id: 157,
                "euname": "NEW CALEDONIA",
                "linked_country": "France",
                "iso3": "NCL",
                "iso2": "NC",
                "grc": "NCA",
                "isonum": "540",
                "country": "New Caledonia",
                "imperitive": "Geographical; Postal; Currency; Telephone"
            },
            {
                id: 158,
                "euname": "NEW ZEALAND",
                "iso3": "NZL",
                "iso2": "NZ",
                "grc": "NEW",
                "isonum": "554",
                "country": "New Zealand"
            },
            {
                id: 159,
                "euname": "Nicaragua",
                "iso3": "NIC",
                "iso2": "NI",
                "grc": "NIC",
                "isonum": "558",
                "country": "Nicaragua"
            },
            {
                id: 160,
                "euname": "Niger",
                "iso3": "NER",
                "iso2": "NE",
                "grc": "NIE",
                "isonum": "562",
                "country": "Niger"
            },
            {
                id: 161,
                "euname": "Nigeria",
                "iso3": "NGA",
                "iso2": "NG",
                "grc": "NIG",
                "isonum": "566",
                "country": "Nigeria"
            },
            {
                id: 162,
                "euname": "NIUE",
                "iso3": "NIU",
                "iso2": "NU",
                "grc": "NIU",
                "isonum": "570",
                "country": "Niue"
            },
            {
                id: 163,
                "linked_country": "Australia",
                "iso3": "NFK",
                "iso2": "NF",
                "grc": "NOF",
                "isonum": "574",
                "country": "Norfolk Island",
                "imperitive": "Geographical; Telephone"
            },
            {
                id: 164,
                "euname": "KOREA, PEOPLE'S DEMOCRATIC REPUBLIC OF",
                "iso3": "PRK",
                "iso2": "KP",
                "grc": "NKO",
                "isonum": "408",
                "country": "North Korea"
            },
            {
                id: 165,
                "linked_country": "United States of America",
                "iso3": "MNP",
                "iso2": "MP",
                "grc": "NMI",
                "isonum": "580",
                "country": "Northern Mariana Islands",
                "imperitive": "Geographical"
            },
            {
                id: 166,
                "euname": "Norway",
                "iso3": "NOR",
                "iso2": "NO",
                "grc": "NOR",
                "isonum": "578",
                "country": "Norway"
            },
            {
                id: 167,
                "euname": "OMAN",
                "iso3": "OMN",
                "iso2": "OM",
                "grc": "OMA",
                "isonum": "512",
                "country": "Oman"
            },
            {
                id: 168,
                "euname": "Pakistan",
                "iso3": "PAK",
                "iso2": "PK",
                "grc": "PAK",
                "isonum": "586",
                "country": "Pakistan"
            },
            {
                id: 169,
                "euname": "PALAU",
                "iso3": "PLW",
                "iso2": "PW",
                "grc": "PAL",
                "isonum": "585",
                "country": "Palau"
            },
            {
                id: 170,
                "euname": "PALESTINIAN OCCUPIED TERRITORY",
                "linked_country": "Israel",
                "iso3": "PSE",
                "iso2": "PS",
                "grc": "PLA",
                "isonum": "275",
                "country": "Palestinian Territories"
            },
            {
                id: 171,
                "euname": "PANAMA",
                "iso3": "PAN",
                "iso2": "PA",
                "grc": "PAN",
                "isonum": "591",
                "country": "Panama"
            },
            {
                id: 172,
                "euname": "PAPUA NEW GUINEA",
                "iso3": "PNG",
                "iso2": "PG",
                "grc": "PAP",
                "isonum": "598",
                "country": "Papua New Guinea"
            },
            {
                id: 173,
                "euname": "PARAGUAY",
                "iso3": "PRY",
                "iso2": "PY",
                "grc": "PAR",
                "isonum": "600",
                "country": "Paraguay"
            },
            {
                id: 174,
                "euname": "PERU",
                "iso3": "PER",
                "iso2": "PE",
                "grc": "PER",
                "isonum": "604",
                "country": "Peru"
            },
            {
                id: 175,
                "euname": "Philippines",
                "iso3": "PHL",
                "iso2": "PH",
                "grc": "PHI",
                "isonum": "608",
                "country": "Philippines"
            },
            {
                id: 176,
                "linked_country": "United Kingdom",
                "iso3": "PCN",
                "iso2": "PN",
                "grc": "PIT",
                "isonum": "612",
                "country": "Pitcairn Islands",
                "imperitive": "Geographical; Postal; Currency; Telephone"
            },
            {
                id: 177,
                "euname": "Poland",
                "iso3": "POL",
                "iso2": "PL",
                "grc": "POL",
                "isonum": "616",
                "country": "Poland"
            },
            {
                id: 178,
                "euname": "Portugal",
                "iso3": "PRT",
                "iso2": "PT",
                "grc": "POR",
                "isonum": "620",
                "country": "Portugal"
            },
            {
                id: 179,
                "euname": "PUERTO RICO",
                "linked_country": "United States",
                "iso3": "PRI",
                "iso2": "PR",
                "grc": "PUE",
                "isonum": "630",
                "country": "Puerto Rico",
                "imperitive": "Geographical"
            },
            {
                id: 180,
                "euname": "QATAR",
                "iso3": "QAT",
                "iso2": "QA",
                "grc": "QAT",
                "isonum": "634",
                "country": "Qatar"
            },
            {
                id: 181,
                "euname": "Romania",
                "iso3": "ROU",
                "iso2": "RO",
                "grc": "ROM",
                "isonum": "642",
                "country": "Romania"
            },
            {
                id: 182,
                "euname": "RUSSIA, FEDERATION OF",
                "iso3": "RUS",
                "iso2": "RU",
                "grc": "RUS",
                "isonum": "643",
                "country": "Russia"
            },
            {
                id: 183,
                "euname": "RUANDA",
                "iso3": "RWA",
                "iso2": "RW",
                "grc": "RWA",
                "isonum": "646",
                "country": "Rwanda"
            },
            {
                id: 184,
                "euname": "REUNION",
                "linked_country": "France",
                "iso3": "REU",
                "iso2": "RE",
                "grc": "REU",
                "isonum": "638",
                "country": "Réunion",
                "imperitive": "Geographical; Postal; Currency; Telephone"
            },
            {
                id: 185,
                "linked_country": "The Netherlands",
                "iso3": "BES",
                "iso2": "BQ",
                "grc": "SAB",
                "isonum": "535",
                "country": "Saba",
                "imperitive": "Geographical; Postal; Currency; Telephone"
            },
            {
                id: 186,
                "linked_country": "France",
                "iso3": "BLM",
                "iso2": "BL",
                "grc": "STB",
                "isonum": "652",
                "country": "Saint Barthélemy",
                "imperitive": "Geographical; Postal; Currency; Telephone"
            },
            {
                id: 187,
                "euname": "SAINT KITTS AND NEVIS",
                "iso3": "KNA",
                "iso2": "KN",
                "grc": "STC",
                "isonum": "659",
                "country": "Saint Christopher & Nevis"
            },
            {
                id: 188,
                "linked_country": "United Kingdom",
                "iso3": "SHN",
                "iso2": "SH",
                "grc": "STH",
                "isonum": "654",
                "country": "Saint Helena",
                "imperitive": "Geographical; Postal; Currency; Telephone"
            },
            {
                id: 189,
                "euname": "SAINT LUCIA",
                "iso3": "LCA",
                "iso2": "LC",
                "grc": "STL",
                "isonum": "662",
                "country": "Saint Lucia"
            },
            {
                id: 190,
                "linked_country": "France",
                "iso3": "MAF",
                "iso2": "MF",
                "grc": "STM",
                "isonum": "663",
                "country": "Saint Martin",
                "imperitive": "Geographical; Postal; Currency; Telephone"
            },
            {
                id: 191,
                "linked_country": "France",
                "iso3": "SPM",
                "iso2": "PM",
                "grc": "SPM",
                "isonum": "666",
                "country": "Saint Pierre & Miquelon",
                "imperitive": "Geographical; Postal; Currency; Telephone"
            },
            {
                id: 192,
                "euname": "SAINT VINCENT AND THE GRENADINES",
                "iso3": "VCT",
                "iso2": "VC",
                "grc": "STV",
                "isonum": "670",
                "country": "Saint Vincent & The Grenadines"
            },
            {
                id: 193,
                "euname": "SAMOA",
                "iso3": "WSM",
                "iso2": "WS",
                "grc": "WSM",
                "isonum": "882",
                "country": "Samoa"
            },
            {
                id: 194,
                "euname": "SAINT MARINO",
                "iso3": "SMR",
                "iso2": "SM",
                "grc": "SAN",
                "isonum": "674",
                "country": "San Marino"
            },
            {
                id: 195,
                "euname": "SAO TOME AND PRINCIPE",
                "iso3": "STP",
                "iso2": "ST",
                "grc": "SAO",
                "isonum": "678",
                "country": "Sao Tome & Principe"
            },
            {
                id: 196,
                "euname": "SUADI ARABIA",
                "iso3": "SAU",
                "iso2": "SA",
                "grc": "SAU",
                "isonum": "682",
                "country": "Saudi Arabia"
            },
            {
                id: 197,
                "euname": "Senegal",
                "iso3": "SEN",
                "iso2": "SN",
                "grc": "SEN",
                "isonum": "686",
                "country": "Senegal"
            },
            {
                id: 198,
                "euname": "Serbia",
                "iso3": "SRB",
                "iso2": "RS",
                "grc": "YUG",
                "isonum": "688",
                "country": "Serbia"
            },
            {
                id: 199,
                "euname": "SEYCHELLES",
                "iso3": "SYC",
                "iso2": "SC",
                "grc": "SEY",
                "isonum": "690",
                "country": "Seychelles"
            },
            {
                id: 200,
                "euname": "SIERRA LEONE",
                "iso3": "SLE",
                "iso2": "SL",
                "grc": "SIE",
                "isonum": "694",
                "country": "Sierra Leone"
            },
            {
                id: 201,
                "euname": "SINGAPORE",
                "iso3": "SGP",
                "iso2": "SG",
                "grc": "SIN",
                "isonum": "702",
                "country": "Singapore"
            },
            {
                id: 202,
                "linked_country": "The Netherlands",
                "iso3": "BES",
                "iso2": "BQ",
                "grc": "STE",
                "isonum": "535",
                "country": "Sint Eustatius",
                "imperitive": "Geographical; Postal; Currency; Telephone"
            },
            {
                id: 203,
                "linked_country": "The Netherlands",
                "iso3": "SXM",
                "iso2": "SX",
                "grc": "SMA",
                "isonum": "534",
                "country": "Sint Maarten",
                "imperitive": "Geographical; Postal; Currency; Telephone"
            },
            {
                id: 204,
                "euname": "Slovakia",
                "iso3": "SVK",
                "iso2": "SK",
                "grc": "SLO",
                "isonum": "703",
                "country": "Slovakia"
            },
            {
                id: 205,
                "euname": "Slovenia",
                "iso3": "SVN",
                "iso2": "SI",
                "grc": "SLV",
                "isonum": "705",
                "country": "Slovenia"
            },
            {
                id: 206,
                "euname": "SOLOMON ISLANDS",
                "iso3": "SLB",
                "iso2": "SB",
                "grc": "SOL",
                "isonum": "90",
                "country": "Solomon Islands"
            },
            {
                id: 207,
                "euname": "SOMALIA",
                "iso3": "SOM",
                "iso2": "SO",
                "grc": "SOM",
                "isonum": "706",
                "country": "Somalia"
            },
            {
                id: 208,
                "euname": "South Africa",
                "iso3": "ZAF",
                "iso2": "ZA",
                "grc": "SAF",
                "isonum": "710",
                "country": "South Africa"
            },
            {
                id: 209,
                "linked_country": "United Kingdom",
                "iso3": "SGS",
                "iso2": "GS",
                "grc": "SGE",
                "isonum": "239",
                "country": "South Georgia & The South Sandwish Islands",
                "imperitive": "Geographical; Postal; Currency; Telephone"
            },
            {
                id: 210,
                "euname": "KOREA, REPUBLIC OF",
                "iso3": "KOR",
                "iso2": "KR",
                "grc": "SKO",
                "isonum": "418",
                "country": "South Korea"
            },
            {
                id: 211,
                "euname": "SOUTH SUDAN",
                "iso3": "SSD",
                "iso2": "SS",
                "grc": "SSU",
                "country": "South Sudan"
            },
            {
                id: 212,
                "euname": "Spain",
                "iso3": "ESP",
                "iso2": "ES",
                "grc": "SPA",
                "isonum": "724",
                "country": "Spain"
            },
            {
                id: 213,
                "euname": "SRI LANKA",
                "iso3": "LKA",
                "iso2": "LK",
                "grc": "SRI",
                "isonum": "144",
                "country": "Sri Lanka"
            },
            {
                id: 214,
                "euname": "Sudan",
                "iso3": "SDN",
                "iso2": "SD",
                "grc": "SUD",
                "isonum": "736",
                "country": "Sudan"
            },
            {
                id: 215,
                "euname": "SURINAM",
                "iso3": "SUR",
                "iso2": "SR",
                "grc": "SUR",
                "isonum": "740",
                "country": "Suriname"
            },
            {
                id: 216,
                "euname": "SWAZILAND",
                "iso3": "SWZ",
                "iso2": "SZ",
                "grc": "SWA",
                "isonum": "748",
                "country": "Swaziland"
            },
            {
                id: 217,
                "euname": "Sweden",
                "iso3": "SWE",
                "iso2": "SE",
                "grc": "SWE",
                "isonum": "752",
                "country": "Sweden"
            },
            {
                id: 218,
                "euname": "Switzerland",
                "iso3": "CHE",
                "iso2": "CH",
                "grc": "SWI",
                "isonum": "756",
                "country": "Switzerland"
            },
            {
                id: 219,
                "euname": "SYRIA, ARAB REPUBLIC",
                "iso3": "SYR",
                "iso2": "SY",
                "grc": "SYR",
                "isonum": "760",
                "country": "Syria"
            },
            {
                id: 220,
                "euname": "TAIWAN",
                "linked_country": "China",
                "iso3": "TWN",
                "iso2": "TW",
                "grc": "TAI",
                "isonum": "158",
                "country": "Taiwan"
            },
            {
                id: 221,
                "euname": "TAJIKISTAN",
                "iso3": "TJK",
                "iso2": "TJ",
                "grc": "TAJ",
                "isonum": "762",
                "country": "Tajikistan"
            },
            {
                id: 222,
                "euname": "TANZANIA, UNITED RE UBLIC OF",
                "iso3": "TZA",
                "iso2": "TZ",
                "grc": "TAN",
                "isonum": "834",
                "country": "Tanzania"
            },
            {
                id: 223,
                "euname": "THAILAND",
                "iso3": "THA",
                "iso2": "TH",
                "grc": "THA",
                "isonum": "764",
                "country": "Thailand"
            },
            {
                id: 224,
                "euname": "TOGO",
                "iso3": "TGO",
                "iso2": "TG",
                "grc": "TOG",
                "isonum": "768",
                "country": "Togo"
            },
            {
                id: 225,
                "linked_country": "New Zealand",
                "iso3": "TKL",
                "iso2": "TK",
                "grc": "TOK",
                "isonum": "772",
                "country": "Tokelau",
                "imperitive": "Geographical; Postal; Telephone"
            },
            {
                id: 226,
                "euname": "TONGA",
                "iso3": "TON",
                "iso2": "TO",
                "grc": "TON",
                "isonum": "776",
                "country": "Tonga"
            },
            {
                id: 227,
                "euname": "TRINIDAD AND TOBAGO",
                "iso3": "TTO",
                "iso2": "TT",
                "grc": "TRI",
                "isonum": "780",
                "country": "Trinidad & Tobago"
            },
            {
                id: 228,
                "euname": "Tunisia",
                "iso3": "TUN",
                "iso2": "TN",
                "grc": "TUN",
                "isonum": "788",
                "country": "Tunisia"
            },
            {
                id: 229,
                "euname": "Turkey",
                "iso3": "TUR",
                "iso2": "TR",
                "grc": "TUR",
                "isonum": "792",
                "country": "Turkey"
            },
            {
                id: 230,
                "euname": "TURKMENISTAN",
                "iso3": "TKM",
                "iso2": "TM",
                "grc": "TUK",
                "isonum": "795",
                "country": "Turkmenistan"
            },
            {
                id: 231,
                "linked_country": "United Kingdom",
                "iso3": "TCA",
                "iso2": "TC",
                "grc": "TUC",
                "isonum": "796",
                "country": "Turks & Caicos Islands",
                "imperitive": "Geographical; Postal; Currency; Telephone"
            },
            {
                id: 232,
                "euname": "TUVALU",
                "iso3": "TUV",
                "iso2": "TV",
                "grc": "TUV",
                "isonum": "798",
                "country": "Tuvalu"
            },
            {
                id: 233,
                "euname": "Uganda",
                "iso3": "UGA",
                "iso2": "UG",
                "grc": "UGA",
                "isonum": "800",
                "country": "Uganda"
            },
            {
                id: 234,
                "euname": "Ukraine",
                "iso3": "UKR",
                "iso2": "UA",
                "grc": "UKR",
                "isonum": "804",
                "country": "Ukraine"
            },
            {
                id: 235,
                "euname": "United Arab Emirates",
                "iso3": "ARE",
                "iso2": "AE",
                "grc": "UAE",
                "isonum": "784",
                "country": "United Arab Emirates"
            },
            {
                id: 236,
                "euname": "United Kingdom",
                "iso3": "GBR",
                "iso2": "GB",
                "grc": "UNI",
                "isonum": "826",
                "country": "United Kingdom"
            },
            {
                id: 237,
                "euname": "United States",
                "iso3": "USA",
                "iso2": "US",
                "grc": "USA",
                "isonum": "840",
                "country": "United States"
            },
            {
                id: 238,
                "euname": "US VIRGIN ISLANDS",
                "linked_country": "United States of America",
                "iso3": "VIR",
                "iso2": "VI",
                "grc": "VIR",
                "isonum": "850",
                "country": "United States Virgin Islands",
                "imperitive": "Geographical"
            },
            {
                id: 239,
                "euname": "URUGUAY",
                "iso3": "URY",
                "iso2": "UY",
                "grc": "URU",
                "isonum": "858",
                "country": "Uruguay"
            },
            {
                id: 240,
                "euname": "UZBEKISTAN",
                "iso3": "UZB",
                "iso2": "UZ",
                "grc": "UZB",
                "isonum": "860",
                "country": "Uzbekistan"
            },
            {
                id: 241,
                "euname": "VANUATU",
                "iso3": "VUT",
                "iso2": "VU",
                "grc": "VAN",
                "isonum": "548",
                "country": "Vanuatu"
            },
            {
                id: 242,
                "euname": "VENEZUELA",
                "iso3": "VEN",
                "iso2": "VE",
                "grc": "VEN",
                "isonum": "862",
                "country": "Venezuela"
            },
            {
                id: 243,
                "euname": "VIETNAM",
                "iso3": "VNM",
                "iso2": "VN",
                "grc": "VIE",
                "isonum": "704",
                "country": "Vietnam"
            },
            {
                id: 244,
                "linked_country": "France",
                "iso3": "WLF",
                "iso2": "WF",
                "grc": "WAL",
                "isonum": "876",
                "country": "Wallis & Futuna",
                "imperitive": "Geographical; Postal; Currency; Telephone"
            },
            {
                id: 245,
                "euname": "WESTERN SAHARA",
                "linked_country": "Morocco",
                "iso3": "ESH",
                "iso2": "EH",
                "grc": "WSA",
                "isonum": "732",
                "country": "Western Sahara",
                "imperitive": "Political"
            },
            {
                id: 246,
                "euname": "Yemen",
                "iso3": "YEM",
                "iso2": "YE",
                "grc": "YEM",
                "isonum": "887",
                "country": "Yemen"
            },
            {
                id: 247,
                "euname": "ZAMBIA",
                "iso3": "ZMB",
                "iso2": "ZM",
                "grc": "ZAM",
                "isonum": "894",
                "country": "Zambia"
            },
            {
                id: 248,
                "euname": "ZIMBABWE",
                "iso3": "ZWE",
                "iso2": "ZW",
                "grc": "ZIM",
                "isonum": "716",
                "country": "Zimbabwe"
            }
        ])


});

//unique function
Array.prototype.unique = function () {
    var r = [];
    o:for(var i = 0, n = this.length; i < n; i++)
    {
        for(var x = 0, y = r.length; x < y; x++)
        {
            if(r[x]===this[i])
            {
                continue o;
            }
        }
        r[r.length] = this[i];
    }
    return r;
};
