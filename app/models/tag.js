import DS from 'ember-data';

export default DS.Model.extend({
    canEdit: DS.attr('boolean'),
    canRemove: DS.attr('boolean'),

    field:DS.attr('string'),  // tipologia: service/area/segment/configuration
    model:DS.attr('string'),  // company/vehicle/...
    isoCode:DS.attr('string'),
    value:DS.attr('string'),   // nome
    visibility: DS.attr('string')
});
