import DS from 'ember-data';

export default DS.Model.extend({
    field:DS.attr('string'),  // tipologia: service/area/segment/configuration
    model:DS.attr('string'),  // company/vehicle/...
    locale:DS.attr('string'),
    value:DS.attr('string')   // nome
});
