import DS from 'ember-data';

export default DS.Model.extend({
    isLimited: DS.attr('boolean'),

    limit: DS.attr('number'),
    value: DS.attr('number'),

    description: DS.attr('string'),
    entity: DS.attr('string'),
    entityType: DS.attr('string'),
    fromCompanyDetail: DS.attr('string'),
    type: DS.attr('string'),   //certification/service
    status: DS.attr('string'),

    date: DS.attr('custom-time'),
    deadline: DS.attr('custom-time'),

    fromCompany: DS.belongsTo('company'),
    company: DS.belongsTo('company', {
        inverse: 'ratings'
    }),
    docTemplate: DS.belongsTo('doc-template'),
    document: DS.belongsTo('document')
});
