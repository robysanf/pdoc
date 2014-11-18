import DS from 'ember-data';
import Ember from 'ember';

export default DS.Transform.extend({
    deserialize: function(serialized) {
        return serialized;
    },

    serialize: function(deserialized) {
        return deserialized;
    }
});
