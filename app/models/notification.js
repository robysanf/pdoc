import DS from 'ember-data';

export default DS.Model.extend({
    highlighted: DS.attr('boolean'),

    date: DS.attr('custom-time'),
    deadline: DS.attr('custom-time'),
    gracePeriod: DS.attr('custom-time'),

    detail: DS.attr('string'),
    fromCompanyDetails: DS.attr('string'),
    fromUserDetails: DS.attr('string'),
    status: DS.attr('string'), //view/hide
    type: DS.attr('string'), //deadline/rating/link/certification
    name: DS.attr('string'),

    valueNum: DS.attr('number'),

    fromCompany: DS.belongsTo('company', {
        async: true}),
    fromUser: DS.belongsTo('user', {
        async: true }),
    company: DS.belongsTo('company', {
        async: true}),

    /***************************************************
     *  PROPERTIES
     */
    showDate: function(){
      return moment(this.get('date')).format("YYYY-MM-DD");
    }.property('date'),
    showDeadline: function(){
        return moment(this.get('deadline')).format("YYYY-MM-DD");
    }.property('deadline'),
    showGracePeriod: function(){
        return moment(this.get('gracePeriod')).format("YYYY-MM-DD");
    }.property('gracePeriod'),

    viewNotification: function() {
        return ( this.get('status') === 'view' );
    }.property('status'),
    isRating: function() {
        return ( this.get('type') === 'rating' );
    }.property('type'),
    isDeadline: function() {
        return ( this.get('type') === 'deadline' );
    }.property('type'),
    isLink: function() {
        return ( this.get('type') === 'link' );
    }.property('type'),
    isCertification: function() {
        return ( this.get('type') === 'certification' );
    }.property('type')

});
