import DS from 'ember-data';
import Vehicle from 'p-doc/models/vehicle';

export default Vehicle.extend({
    weight: DS.attr('number'),  //peso complessivo
    tare: DS.attr('number'),

    chassisNumber: DS.attr('string')
});
