import DS from 'ember-data';
import Ember from 'ember';

export default DS.Transform.extend({
    deserialize: function(serialized) {
        return Ember.isNone(serialized) ? null : serialized;
    },

    serialize: function(deserialized) {
        return Ember.isNone(deserialized) ? null : deserialized;
    }
});
