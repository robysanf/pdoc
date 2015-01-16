import DS from 'ember-data';


export default DS.Model.extend({
    canEdit: DS.attr('boolean'),
    canRemove: DS.attr('boolean'),

    name: DS.attr('string'),
    title: DS.attr('string'),
    description: DS.attr('string'),
    visibility: DS.attr('string'),

    date: DS.attr('custom-date'),

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
