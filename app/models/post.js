import DS from 'ember-data';


export default DS.Model.extend({
    name: DS.attr('string'),
    title: DS.attr('string'),
    description: DS.attr('string'),

    date: DS.attr('custom-time'),

    user: DS.belongsTo('user', {
        async: true }),
    company: DS.belongsTo('company', {
        async: true}),
    files: DS.hasMany('files', {
        async: true}),
    /*************************************************
     * PROPERTIES
     */
    timeFrom: function(){
        return moment(this.get('date')).fromNow() ;
    }.property('date')

});
