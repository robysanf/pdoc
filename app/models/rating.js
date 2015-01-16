import DS from 'ember-data';

export default DS.Model.extend({
    canEdit: DS.attr('boolean'),
    canRemove: DS.attr('boolean'),
    isLimited: DS.attr('boolean'),

    limit: DS.attr('number'),
    value: DS.attr('number'),

    description: DS.attr('string'),
    entity: DS.attr('string'),
    entityType: DS.attr('string'),
    fromCompanyDetail: DS.attr('string'),
    type: DS.attr('string'),   //certification/service
    status: DS.attr('string'),
    visibility: DS.attr('string'),

    date: DS.attr('custom-date'),
    deadline: DS.attr('custom-date'),

    fromCompany: DS.belongsTo('company'),
    company: DS.belongsTo('company', {
        inverse: 'ratings'
    }),
    docTemplate: DS.belongsTo('doc-template'),
    document: DS.belongsTo('document'),

    /**************************************
     * PROPERTIES
     * */
    isTypeService: function(){
       return (this.get('type') === 'service');
    }.property('type'),
    isTypeCertification: function(){
        return (this.get('type') === 'certification');
    }.property('type')
});
