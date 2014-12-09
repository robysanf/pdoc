import DS from 'ember-data';

export default DS.Model.extend({
    valueNum: DS.attr('number'),

    code: DS.attr('string'),
    valueStr: DS.attr('string'),

    company: DS.belongsTo('company', {
        async: true})
});
