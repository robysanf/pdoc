import DS from 'ember-data';

export default DS.Transform.extend({
    deserialize: function(serialized) {
        var isNull =  (serialized === null || serialized === undefined || serialized === '');
        return isNull ? null : serialized;
        //return Ember.isNone(serialized) ? null : serialized;
    },

    serialize: function(deserialized) {
       // moment().zone("+01:00");
        var isNull =  (deserialized === null || deserialized === undefined || deserialized === '');
        return isNull ? null : encodeURIComponent(moment(deserialized).zone("+01:00").format("YYYY-MM-DD"));//.format("YYYY-MM-DD").zone());// HH:mm:ss Z     ATTENZIONE!! CAMBIARE FORMAT ANCHE IN MODEL:COMPANY ALLA PROPERTY: firedNotifications
        //return Ember.isNone(deserialized) ? null : moment(deserialized).format("YYYY-MM-DD");
    }
});
