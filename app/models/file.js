import DS from 'ember-data';

export default DS.Model.extend({
    canEdit: DS.attr('boolean'),
    canRemove: DS.attr('boolean'),

    key: DS.attr('string'),
    name: DS.attr('string'),
    code: DS.attr('string'),
    path: DS.attr('string'),
    entity: DS.attr('string'),
    entityType: DS.attr('string'),
    type: DS.attr('string'),

    company: DS.belongsTo('company',{
        inverse: 'files'})
//    authorizedCompanies: DS.hasMany('company',{
//        async: true})
//    visibility: DS.attr('string') //public, private, root
});
