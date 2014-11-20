import DS from 'ember-data';

export default DS.Model.extend({
    accessView: DS.attr('string'),
    accessRemove: DS.attr('string'),
    accessEdit: DS.attr('string'),
    accessNew: DS.attr('string'),
    access: DS.attr('string'),
    name: DS.attr('string'),
    value: DS.attr('string')


});
