import DS from 'ember-data';

export default DS.Model.extend({
    canEdit: DS.attr('boolean'),
    canRemove: DS.attr('boolean'),
    isCertified: DS.attr('boolean'),

    date: DS.attr('custom-date'),
    validityDate: DS.attr('custom-date'),
    deadline: DS.attr('custom-date'),
    grace: DS.attr('custom-date'),
    alert: DS.attr('custom-date'),

    entity: DS.attr('string'),
    name: DS.attr('string'),
    entityType: DS.attr('string'),   //user/company/vehicle
    note: DS.attr('string'),
    type: DS.attr('string'),      //invoice/document/other
    status: DS.attr('string'),       //active/inactive

    company: DS.belongsTo('company', {
        async: true,
        inverse: 'documents' }),
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
            switch (this.get('docTemplate').get('alertType')){
                case 'days':
                    new_date = moment(this.get('validityDate')).add(this.get('docTemplate').get('alertNum'), 'day');
                    this.set('alert', new_date);
                    break;
                case 'months':
                    new_date = moment(this.get('validityDate')).add(this.get('docTemplate').get('alertNum'), 'month');
                    this.set('alert', new_date);
                    break;
                case 'years':
                    new_date = moment(this.get('validityDate')).add(this.get('docTemplate').get('alertNum'), 'year');
                    this.set('alert', new_date);
                    break;
            }
        }

    }.observes('validityDate', 'type'),
    set_grace: function(){
        var new_date;
        if( this.get('type') === 'document'){
            switch (this.get('docTemplate').get('graceType')){
                case 'days':
                    new_date = moment(this.get('validityDate')).add(this.get('docTemplate').get('graceNum'), 'day');
                    this.set('grace', new_date);
                    break;
                case 'months':
                    new_date = moment(this.get('validityDate')).add(this.get('docTemplate').get('graceNum'), 'month');
                    this.set('grace', new_date);
                    break;
                case 'years':
                    new_date = moment(this.get('validityDate')).add(this.get('docTemplate').get('graceNum'), 'year');
                    this.set('grace', new_date);
                    break;
            }
        }

    }.observes('validityDate', 'type'),
    set_deadline: function(){
        if( this.get('type') === 'document'){
            this.set('deadline', this.get('docTemplate').get('deadline'));
        }

    }.observes('docTemplate.deadline', 'type'),

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
            return moment(this.get('date')).format('YYYY-MM-DD');
        }
    }.property('date'),
    validityDate_toString: function() {
        if( this.get('validityDate') ){
            return moment(this.get('validityDate')).format('YYYY-MM-DD');
        }
    }.property('validityDate'),
    deadline_toString: function() {
        if( this.get('deadline') ){
            return moment(this.get('deadline')).format('YYYY-MM-DD');
        }
    }.property('deadline'),
    grace_toString: function() {
        if( this.get('grace') ){
            return moment(this.get('grace')).format('YYYY-MM-DD');
        }
    }.property('grace'),
    alert_toString: function() {
        if( this.get('alert') ){
            return moment(this.get('alert')).format('YYYY-MM-DD');
        }
    }.property('alert')
});
