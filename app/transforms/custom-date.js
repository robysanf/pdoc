import DS from 'ember-data';

export default DS.Transform.extend({
    deserialize: function(serialized) {
        var isNull =  (serialized === null || serialized === undefined || serialized === '');
        //console.log('serialized: '+serialized);

        return isNull ? null : moment(serialized, "YYYY-MM-DD HH:mm:ss Z").format("YYYY-MM-DD");
        //return Ember.isNone(serialized) ? null : serialized;
    },

    serialize: function(deserialized) {
       // moment().zone("+01:00");
        var isNull =  (deserialized === null || deserialized === undefined || deserialized === '');
        //console.log('deserialized: '+deserialized);
        return isNull ? null : encodeURIComponent(moment(deserialized, "YYYY-MM-DD HH:mm:ss Z").format("YYYY-MM-DD"));//.format("YYYY-MM-DD").zone());// HH:mm:ss Z     ATTENZIONE!! CAMBIARE FORMAT ANCHE IN MODEL:COMPANY ALLA PROPERTY: firedNotifications
        //return Ember.isNone(deserialized) ? null : moment(deserialized).format("YYYY-MM-DD");
    }
});
