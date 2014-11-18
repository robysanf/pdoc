import DS from 'ember-data';

export default DS.Model.extend({
    birthDate:  DS.attr('custom-date'),

    username:DS.attr('string'),
    firstName: DS.attr('string'),
    lastName: DS.attr('string'),
    phone: DS.attr('string'),
    skype: DS.attr('string'),
    profile: DS.attr('string'), //clerk/driver
    type: DS.attr('string'),   //powerUser/
    curriculum: DS.attr('string'),

    patents: DS.attr('raw'),
    emails: DS.attr('raw'),
    languages: DS.attr('raw'),

    company: DS.belongsTo('company'),
    /*************************************************
     * PROPERTIES
     */
    isClerk: function(){
        return this.get('profile') === 'clerk';
    }.property('profile'),
    isDriver: function(){
        return this.get('profile') === 'driver';
    }.property('profile')
});
