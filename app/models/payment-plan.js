import DS from 'ember-data';

export default DS.Model.extend({
    canEdit: DS.attr('boolean'),
    canRemove: DS.attr('boolean'),

    amount : DS.attr('number'),
    credit : DS.attr('number'),

    name: DS.attr('string'),
    description: DS.attr('string'),
    currency : DS.attr('string'),
    visibility: DS.attr('string'), //public, private, root
    type: DS.attr('string'), //certification, service

    company:  DS.belongsTo('company',{
        async: true
    }),

    /******************************************************
     * PROPERTIES
     */

    isService: function(){
       return this.get('type') === 'service';
    }.property('type')
});
