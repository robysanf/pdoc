import DS from 'ember-data';

export default DS.Model.extend({
    amount: DS.attr('number'),
    credit: DS.attr('number'),

    date: DS.attr('custom-time'),

    key: DS.attr('string'),

    company: DS.belongsTo('company')
});
