import DS from 'ember-data';

export default DS.Model.extend({
    canEdit: DS.attr('boolean'),
    canRemove: DS.attr('boolean'),

    amount: DS.attr('number'),
    credit: DS.attr('number'),

    date: DS.attr('custom-date'),

    key: DS.attr('string'),
    currency: DS.attr('string'),
    visibility: DS.attr('string'),

    company: DS.belongsTo('company'),
    paymentPlan: DS.belongsTo('paymentPlan'),
    user: DS.belongsTo('user'),

    files: DS.hasMany('files', {
        async: true})
});
