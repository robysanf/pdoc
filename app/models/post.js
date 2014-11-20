import DS from 'ember-data';


export default DS.Model.extend({
    name: DS.attr('string'),
    title: DS.attr('string'),
    description: DS.attr('string'),

    date: DS.attr('custom-time'),

    user: DS.belongsTo('user', {
        async: true }),
    company: DS.belongsTo('company', {
        async: true }),

    /*************************************************
     * PROPERTIES
     */
    timeFrom: function(){
        var timeFrom =  moment(this.get('date')).fromNow() ;

        return timeFrom;
    }.property('date')

});
