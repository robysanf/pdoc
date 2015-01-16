import DS from 'ember-data';

export default DS.Model.extend({
    canEdit: DS.attr('boolean'),
    canRemove: DS.attr('boolean'),

    valueNum: DS.attr('number'),

    name: DS.attr('string'),
    code: DS.attr('string'),
    valueStr: DS.attr('string'),
    visibility: DS.attr('string'), //public, private, root

    company: DS.belongsTo('company', {
        async: true})
});
