import DS from 'ember-data';

export default DS.Model.extend({
    canEdit: DS.attr('boolean'),
    canRemove: DS.attr('boolean'),

    certificationScore:DS.attr('number'),

    birthDate: DS.attr('custom-date'),

    username:DS.attr('string'),
    password:DS.attr('string'),
    firstName: DS.attr('string'),
    lastName: DS.attr('string'),
    phone: DS.attr('string'),
    skype: DS.attr('string'),
    profile: DS.attr('string'), //powerUser/user/admin
    type: DS.attr('string'),   //clerk/driver
    curriculum: DS.attr('string'),
    email: DS.attr('string'),

    patents: DS.attr('raw'),
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
    totalCertificationRating: function(){
        var totRatings = 0, ratings = this.get('ratings');

        ratings.forEach( function(val) {
            if(val.get('type') === 'certification'){
                totRatings += 1;
            }
        });

        return totRatings;
    }.property('ratings.@each.type'),
    isClerk: function(){
        return this.get('type') === 'clerk';
    }.property('type'),
    isDriver: function(){
        return this.get('type') === 'driver';
    }.property('type'),

    birthDate_toString: function(){
        return moment(this.get('birthDate')).format('YYYY-MM-DD');
    }.property('birthDate')
});
