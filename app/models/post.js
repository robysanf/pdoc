import DS from 'ember-data';


export default DS.Model.extend({
    canEdit: DS.attr('boolean'),
    canRemove: DS.attr('boolean'),

    name: DS.attr('string'),
    title: DS.attr('string'),
    description: DS.attr('string'),
    visibility: DS.attr('string'),

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
        return moment.utc(this.get('date'), 'YYYY-MM-DD HH:mm:ss Z').fromNow();
    }.property('date')

});
