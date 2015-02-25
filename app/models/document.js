import DS from 'ember-data';

export default DS.Model.extend({
    canEdit: DS.attr('boolean'),
    canRemove: DS.attr('boolean'),
    isCertified: DS.attr('boolean'),
    isOwnerCompany: DS.attr('boolean'),

    date: DS.attr('custom-date'),
    validityDate: DS.attr('custom-date'),
    //deadline: DS.attr('custom-date'),
    expirationDate: DS.attr('custom-date'),
    grace: DS.attr('custom-date'),
    alert: DS.attr('custom-date'),

    entity: DS.attr('string'),
    name: DS.attr('string'),
    entityType: DS.attr('string'),   //user/company/vehicle
    note: DS.attr('string'),
    type: DS.attr('string'),      //invoice/document/other
    status: DS.attr('string'),       //active/inactive
    visibility: DS.attr('string'), //public, private, root

    company: DS.belongsTo('company', {
        async: true}),
    fakeCompany: DS.belongsTo('company', {
        async: true,
        inverse: 'documents'}),
    docTemplate: DS.belongsTo('doc-template', {
        async: true}),
    certifier: DS.belongsTo('company', {
        async: true }),
    files: DS.hasMany('file', {
        async: true}),
    /*******************************************************
     * OBSERVES
     */

    set_alert: function(){
        var new_date;
        if( this.get('type') === 'document'){
            var docTemp_grace = this.get('docTemplate').get('alertNum');
            var validity = this.get('validityDate');

            switch (this.get('docTemplate').get('alertType')){
                case 'days':
                    new_date = moment( validity ).add( docTemp_grace, 'day');
                    this.set('alert', new_date);
                    break;
                case 'months':
                    new_date = moment( validity ).add( docTemp_grace, 'month');
                    this.set('alert', new_date);
                    break;
                case 'years':
                    new_date = moment( validity ).add( docTemp_grace, 'year');
                    this.set('alert', new_date);
                    break;
            }
        }

    }.observes('docTemplate', 'validityDate', 'type'),

    set_grace: function(){
        var new_date;
        if( this.get('type') === 'document'){
            var docTemp_grace = this.get('docTemplate').get('graceNum');

            switch (this.get('docTemplate').get('graceType')){
                case 'days':
                    new_date = moment(this.get('validityDate')).add( docTemp_grace, 'day');
                    this.set('grace', new_date);
                    break;
                case 'months':
                    new_date = moment(this.get('validityDate')).add( docTemp_grace, 'month');
                    this.set('grace', new_date);
                    break;
                case 'years':
                    new_date = moment(this.get('validityDate')).add( docTemp_grace, 'year');
                    this.set('grace', new_date);
                    break;
            }
        }

    }.observes('docTemplate', 'validityDate', 'type'),

    set_expirationDate: function(){
        var new_date;
        if( this.get('type') === 'document'){

            var docTemp = this.get('docTemplate');

            if( docTemp ){
                var docTemp_deadline = docTemp.get('validityNum');
                if( docTemp_deadline ){
                    switch ( this.get('docTemplate').get('validityType')){
                        case 'days':
                            new_date = moment(this.get('validityDate')).add( docTemp_deadline, 'day');
                            this.set('expirationDate', new_date);
                            break;
                        case 'months':
                            new_date = moment(this.get('validityDate')).add( docTemp_deadline, 'month');
                            this.set('expirationDate', new_date);
                            break;
                        case 'years':
                            new_date = moment(this.get('validityDate')).add( docTemp_deadline, 'year');
                            this.set('expirationDate', new_date);
                            break;
                    }

                } else {
                    this.set('expirationDate', docTemp.get('deadline'));
                }
            }
        }

    }.observes('docTemplate', 'validityDate', 'type'),


    /*******************************************************
     * PROPERTIES
     * */
    isInvoice: function(){
       return ( this.get('type') === 'invoice' );
    }.property('type'),
    isDocument: function(){
        return ( this.get('type') === 'document' );
    }.property('type'),
    isOther: function(){
        return ( this.get('type') === 'other' );
    }.property('type'),

    isActive: function(){
        return ( this.get('status') === 'active' );
    }.property('status'),

    date_toString: function() {
        if( this.get('date') ){
            return moment(this.get('date')).format('LL');
        }
    }.property('date'),
    validityDate_toString: function() {
        if( this.get('validityDate') ){
            return moment(this.get('validityDate')).format('LL');
        }
    }.property('validityDate'),
    showExpirationDate: function() {
        if( this.get('expirationDate') ){
            return moment(this.get('expirationDate')).format('LL');
        }
    }.property('expirationDate'),
//    deadline_toString: function() {
//        if( this.get('deadline') ){
//            return moment(this.get('deadline')).format('LL');
//        }
//    }.property('deadline'),
    grace_toString: function() {
        if( this.get('grace') ){
            return moment(this.get('grace')).format('LL');
        }
    }.property('grace'),
    alert_toString: function() {
        if( this.get('alert') ){
            return moment(this.get('alert')).format('LL');
        }
    }.property('alert')
});
