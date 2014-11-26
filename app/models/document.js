import DS from 'ember-data';

export default DS.Model.extend({
    entity: DS.attr('string'),
    name: DS.attr('string'),
    entityType: DS.attr('string'),   //user/company/vehicle
    note: DS.attr('string'),
    type: DS.attr('string'),      //invoice/document/other
    status: DS.attr('string'),       //active/inactive

    date: DS.attr('custom-time'),
    validityDate: DS.attr('custom-time'),
    deadline: DS.attr('custom-time'),
    grace: DS.attr('custom-time'),

    company: DS.belongsTo('company', {
        async: true,
        inverse: 'documents' }),
    docTemplate: DS.belongsTo('doc-template', {
        async: true}),

    certifier: DS.belongsTo('company', {
        async: true }),

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

    date_toString: function() {
        return moment(this.get('date')).format('YYYY-MM-DD');
    }.property('date'),
    validityDate_toString: function() {
        return moment(this.get('validityDate')).format('YYYY-MM-DD');
    }.property('validityDate'),
    deadline_toString: function() {
        return moment(this.get('deadline')).format('YYYY-MM-DD');
    }.property('deadline'),
    grace_toString: function() {
        return moment(this.get('grace')).format('YYYY-MM-DD');
    }.property('grace')

});
