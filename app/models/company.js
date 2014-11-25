import DS from 'ember-data';

export default DS.Model.extend({
    credit:DS.attr('number'),
    cardNumber:DS.attr('number'),

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

    emails:DS.attr('raw'),
    services:DS.attr('raw'),         //servizi offerti (ex: trasporto animali)
    segments:DS.attr('raw'),         //tratte coperte
    areas:DS.attr('raw'),            //areee coperte

    certifier: DS.belongsTo('company',{
        async: true,
        inverse: 'childCertifiers'}),
    childCertifiers: DS.hasMany('company',{
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
    //serviceRatings: DS.hasMany('serviceRating'),
    //certificationRatings: DS.hasMany('certificationRating')
    //parentCompany: DS.belongsTo('company'),
    //childCompanies: DS.hasMany('company'),
    documents: DS.hasMany('document', {
        async: true,
        inverse: 'company' }),
    files: DS.hasMany('file', {
        async: true}),
    grants: DS.hasMany('grant',{
        async:true }),
    /****************************************************
     *      PROPERTIES
     */
    hideCardNumber: function() {
        return '**************' + this.get('cardNumber');
    }.property('cardNumber'),
    isCertifier: function() {
        return ( this.get('type') === 'certifier' );
    }.property('type'),
    firedNotifications: function() {
        var notify = this.get("notifications"), fired = null;

        notify.forEach(function(val){
            if( val.get('highlighted') === true ) {
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
