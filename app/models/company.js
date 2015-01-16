import DS from 'ember-data';

export default DS.Model.extend({
    canEdit: DS.attr('boolean'),
    canRemove: DS.attr('boolean'),

    cardNumber:DS.attr('number'),
    certificationCredit:DS.attr('number'),     //ammontare del credito per ottenere certificazioni
    visualizationCredit:DS.attr('number'),     //ammontare del credito per visualizzare

    certificationScore:DS.attr('number'),      //punteggio per certificazione
    serviceScore:DS.attr('number'),            //punteggio per servizi offerti
    driverScore:DS.attr('number'),             //punteggio per autisti
    truckScore:DS.attr('number'),              //punteggio per camion
    trailerScore:DS.attr('number'),            //punteggio per

    publishableKey: DS.attr('string'),
    name: DS.attr('string'),
    vat: DS.attr('string'),                  //partita iva
    transportListCode: DS.attr('string'),    //codice albo
    chamberOfCommerce: DS.attr('string'),    //camera di commercio
    street: DS.attr('string'),
    district: DS.attr('string'),
    city: DS.attr('string'),
    zipCode: DS.attr('string'),
    province: DS.attr('string'),
    country: DS.attr('string'),
    fax: DS.attr('string'),
    phone: DS.attr('string'),
    description: DS.attr('string'),
    type: DS.attr('string'),           //carrier/shipper/supplier/certifier
    visibility: DS.attr('string'), //public, private, root

    emails:DS.attr('raw'),
    services:DS.attr('raw'),         //servizi offerti (ex: trasporto animali)
    segments:DS.attr('raw'),         //tratte coperte
    areas:DS.attr('raw'),            //areee coperte

    certifier: DS.belongsTo('company',{
        async: true,
        inverse: 'certifiedCompanies'}),
    certifiedCompanies: DS.hasMany('company',{
        async: true,
        inverse: 'certifier'}),

    users : DS.hasMany('user',{
        async: true }),
    vehicles: DS.hasMany('vehicle',{
        async: true }),
    refills: DS.hasMany('refill',{
        async: true}),
    links: DS.hasMany('company',{
        async: true,
        inverse: 'childLinks'}),
    childLinks: DS.hasMany('company',{
        async: true,
        inverse: 'links'}),
    notifications: DS.hasMany('notification', {
        inverse: 'company',
        async: true}),
    docTemplates: DS.hasMany('docTemplate', {
        async: true}),
    posts: DS.hasMany('post', {
        async: true}),
    ratings: DS.hasMany('rating', {
    async: true,
    inverse: 'company'}),

    documents: DS.hasMany('document', {
        async: true,
        inverse: 'fakeCompany' }),
    files: DS.hasMany('file', {
        async: true}),
    grants: DS.hasMany('grant',{
       async:true }),
    configurations: DS.hasMany('configuration',{
        async: true}),
    paymentPlans: DS.hasMany('paymentPlan',{
        async: true}),

    /****************************************************
     *      PROPERTIES
     */
    show_serviceScore: function(){
        return this.get('serviceScore') !== undefined && this.get('serviceScore') !== null;
    }.property('serviceScore'),
    show_certificationScore: function(){
        return this.get('certificationScore') !== undefined && this.get('certificationScore') !== null;
    }.property('certificationScore'),

    totalCertificationRating: function(){
        var totRatings = 0, ratings = this.get('ratings');

        ratings.forEach( function(val) {
            if(val.get('type') === 'certification'){
                totRatings += 1;
            }
        });

        return totRatings;
    }.property('ratings.@each.type'),
    totalServiceRating: function(){
        var totRatings = 0, ratings = this.get('ratings');

        ratings.forEach( function(val) {
            if(val.get('type') === 'service'){
                totRatings += 1;
            }
        });

        return totRatings;
    }.property('ratings.@each.type'),

    totalWeight: function() {
        var totWeight = 0, weights = this.get('configurations');

        weights.forEach( function(val) {
            totWeight += Number(val.get('valueNum'));
        });

        return totWeight;
    }.property('configurations.@each.valueNum'),
    hideCardNumber: function() {
        var card = String(this.get('cardNumber'));
        return '**************' + card;
    }.property('cardNumber'),
    isCarrier: function() {
        return ( this.get('type') === 'carrier' );
    }.property('type'),
    isCertifier: function() {
        return ( this.get('type') === 'certifier' );
    }.property('type'),
    firedNotifications: function() {
        var notify = this.get("notifications"), fired = null;
        var today = moment(Date());

        notify.forEach(function(val){
            var date = moment(val.get('date'));
            var diff =  today.diff(date);
            if( val.get('highlighted') === true && diff > 0 ) {
                fired += 1;
            }
        });
        return fired;
    }.property('notifications.@each.highlighted'),
//    //  la somma di tutti i punteggi assegnati ai doc-template di type: company
    companyRating: function() {
        var docTemp = this.get("docTemplates"), tot = 0;

        if(docTemp){
            docTemp.forEach(function(val){
                if( val.get('type') === 'company' ) {
                    tot += Number(val.get('rateValue'));
                }
            });
            if(tot) {
                return tot;
            } else {
                return 0;
            }
        }
    }.property('docTemplates.@each.rateValue'),

    //  la somma di tutti i punteggi assegnati ai doc-template di type: truck
    truckRating: function() {
        var docTemp = this.get("docTemplates"), tot = 0;

        if(docTemp){
            docTemp.forEach(function(val){
                if( val.get('type') === 'truck' ) {
                    tot += Number(val.get('rateValue'));
                }
            });
            if(tot) {
                return tot;
            } else {
                return 0;
            }
        }
    }.property('docTemplates.@each.rateValue'),
   //  stringa per definire lo style della progress-bar
    progressCompanyRating: function() {
        return 'width:' + this.get('companyRating') + '%';
    }.property('companyRating'),

    // restituisce true nel caso in cui il punteggio totale sia maggiore di 100
    isCompanyRatingOut: function() {
        if ( this.get('companyRating') === 100 ) {
            return 'progress-bar progress-bar-success';
        } else if ( this.get('companyRating') > 100 ) {
            return 'progress-bar progress-bar-danger';
        } else {
            return 'progress-bar progress-bar-warning';
        }
    }.property('companyRating'),

    //  la somma di tutti i punteggi assegnati ai doc-template di type: driver
    driverRating: function() {
        var docTemp = this.get("docTemplates"), tot = 0;
        if(docTemp){
            docTemp.forEach(function(val){
                if( val.get('type') === 'driver' ) {
                    tot += Number(val.get('rateValue'));
                }
            });
            if(tot) {
                return tot;
            } else {
                return 0;
            }
        }

    }.property('docTemplates.@each.rateValue'),

    //  stringa per definire lo style della progress-bar
    progressDriverRating: function() {
        return 'width:' + this.get('driverRating') + '%';
    }.property('driverRating'),

    // restituisce true nel caso in cui il punteggio totale sia maggiore di 100
    isDriverRatingOut: function() {
        if ( this.get('driverRating') === 100 ) {
            return 'progress-bar progress-bar-success';
        } else if ( this.get('driverRating') > 100 ) {
            return 'progress-bar progress-bar-danger';
        } else {
            return 'progress-bar progress-bar-warning';
        }
    }.property('driverRating'),


    //  stringa per definire lo style della progress-bar
    progressTruckRating: function() {
        return 'width:' + this.get('truckRating') + '%';
    }.property('truckRating'),

    // restituisce true nel caso in cui il punteggio totale sia maggiore di 100
    isTruckRatingOut: function() {
        if ( this.get('truckRating') === 100 ) {
            return 'progress-bar progress-bar-success';
        } else if ( this.get('truckRating') > 100 ) {
            return 'progress-bar progress-bar-danger';
        } else {
            return 'progress-bar progress-bar-warning';
        }
    }.property('truckRating'),

    //  la somma di tutti i punteggi assegnati ai doc-template di type: trailer
    trailerRating: function() {
        var docTemp = this.get("docTemplates"), tot = 0;

        if(docTemp) {
            docTemp.forEach(function(val){
                if( val.get('type') === 'trailer' ) {
                    tot += Number(val.get('rateValue'));
                }
            });
            if(tot) {
                return tot;
            } else {
                return 0;
            }
        }
    }.property('docTemplates.@each.rateValue'),

    //  stringa per definire lo style della progress-bar
    progressTrailerRating: function() {
        return 'width:' + this.get('trailerRating') + '%';
    }.property('trailerRating'),

    // restituisce true nel caso in cui il punteggio totale sia maggiore di 100
    isTrailerRatingOut: function() {
        if ( this.get('trailerRating') === 100 ) {
            return 'progress-bar progress-bar-success';
        } else if ( this.get('trailerRating') > 100 ) {
            return 'progress-bar progress-bar-danger';
        } else {
            return 'progress-bar progress-bar-warning';
        }
    }.property('trailerRating')
});
