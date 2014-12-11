import DS from 'ember-data';

export default DS.Model.extend({
    canEdit: DS.attr('boolean'),
    canRemove: DS.attr('boolean'),

    birthDate: DS.attr('custom-time'),

    username:DS.attr('string'),
    password:DS.attr('string'),
    firstName: DS.attr('string'),
    lastName: DS.attr('string'),
    phone: DS.attr('string'),
    skype: DS.attr('string'),
    profile: DS.attr('string'), //powerUser/user/admin
    type: DS.attr('string'),   //clerk/driver
    curriculum: DS.attr('string'),

    patents: DS.attr('raw'),
    email: DS.attr('string'),
    languages: DS.attr('raw'),

    company: DS.belongsTo('company'),
    files: DS.hasMany('files', {
        async: true}),
    documents: DS.hasMany('document', {
        async: true}),
    ratings: DS.hasMany('rating', {
        async: true}),
    grants: DS.hasMany('grant',{
        async:true }),
    /*************************************************
     * PROPERTIES
     */
    isClerk: function(){
        return this.get('type') === 'clerk';
    }.property('profile'),
    isDriver: function(){
        return this.get('type') === 'driver';
    }.property('profile'),

    birthDate_toString: function(){
        return moment(this.get('birthDate')).format('YYYY-MM-DD');
    }.property('birthDate')
});
