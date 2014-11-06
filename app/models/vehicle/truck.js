import DS from 'ember-data';
import Vehicle from 'p-doc/models/vehicle';

export default Vehicle.extend({
    category: DS.attr('string')   //euro1, euro2, ... euro6
});
