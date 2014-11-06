import DS from 'ember-data';

export default DS.Model.extend({
    birthDate:  DS.attr('date'),

    username:DS.attr('string'),
    firstName: DS.attr('string'),
    lastName: DS.attr('string'),
    phone: DS.attr('string'),
    skype: DS.attr('string'),
    curriculum: DS.attr('string'),
    profile: DS.attr('string'), //powerUser/
    type: DS.attr('string'), //clerk/driver

    emails: DS.attr('raw'),
    languages: DS.attr('raw'),

    company: DS.belongsTo('company', {
        async: true }),
    /*************************************************
     * PROPERTIES
     */
    isClerk: function(){
        return this.get('type') === 'clerk';
    }.property('type'),
    isDriver: function(){
        return this.get('type') === 'driver';
    }.property('type')
});
