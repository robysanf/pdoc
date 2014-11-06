import DS from 'ember-data';

export default DS.Model.extend({
    credit: attr('number'),
    cardNumber: attr('number'),

    //key: attr('string'),                   //solo server
    name: attr('string'),
    vat: attr('string'),                  //partita iva
    transportListCode: attr('string'),    //codice albo
    chamberOfCommerce: attr('string'),    //camera di commercio
    street: attr('string'),
    district: attr('string'),
    city: attr('string'),
    zipCode: attr('string'),
    province: attr('string'),
    country: attr('string'),
    fax: attr('string'),
    phone: attr('string'),
    description: attr('string'),
    type: attr('string'),           //carrier/shipper/supplier/certifier

    emails: attr('raw'),
    services: attr('raw'),         //servizi offerti (ex: trasporto animali)
    segments: attr('raw'),         //tratte coperte
    areas: attr('raw'),            //areee coperte

    users : DS.hasMany('user',{
        polymorphic: true,
        async: true }),
    vehicles: DS.hasMany('vehicle',{
        polymorphic: true,
        async: true }),
    refills: DS.hasMany('refill',{
        async: true }),
    links: DS.hasMany('company',{
        async: true }),
    notifications: DS.hasMany('notification', {
        polymorphic: true,
        async: true }),
    docTemplates: DS.hasMany('docTemplate', {
        async: true }),
    //serviceRatings: DS.hasMany('serviceRating'),
    //certificationRatings: DS.hasMany('certificationRating')
    //parentCompany: DS.belongsTo('company'),
    //childCompanies: DS.hasMany('company'),
    //documents: DS.hasMany('document'),
    //files: DS.hasMany('document'),
    /********************************************************
     * PROPERTIES
     */
    hideCardNumber: function() {
        return '**************' + this.get('cardNumber')
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
    //  la somma di tutti i punteggi assegnati ai doc-template di type: company
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
