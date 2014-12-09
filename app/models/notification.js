import DS from 'ember-data';

export default DS.Model.extend({
    highlighted: DS.attr('boolean'),

    date: DS.attr('custom-time'),
    deadline: DS.attr('custom-time'),
    gracePeriod: DS.attr('custom-time'),

    actionToken: DS.attr('string'),
    detail: DS.attr('string'),
    description: DS.attr('string'),
    entity: DS.attr('string'),
    entityType: DS.attr('string'),
    fromCompanyDetails: DS.attr('string'),
    fromUserDetails: DS.attr('string'),
    name: DS.attr('string'),
    status: DS.attr('string'), //view/hide
    type: DS.attr('string'), //deadline/rating/link/certification

    valueNum: DS.attr('number'),

    fromCompany: DS.belongsTo('company', {
        async: true}),
    fromUser: DS.belongsTo('user', {
        async: true }),
    company: DS.belongsTo('company', {
        async: true}),
    docTemplate: DS.belongsTo('docTemplate', {
        async: true}),
    referringNotification: DS.belongsTo('notification', {
        async: true,
        inverse: 'childNotification'}),
    childNotification: DS.belongsTo('notification', {
        async: true,
        inverse: 'referringNotification'}),
    files: DS.hasMany('files', {
        async: true}),

    /***************************************************
     *  PROPERTIES
     */
    is_actionToken: function(){
       return this.get('actionToken') !== null;
    }.property('actionToken'),
    showDate: function(){
      return moment(this.get('date')).format("YYYY-MM-DD");
    }.property('date'),
    showDeadline: function(){
        return moment(this.get('deadline')).format("YYYY-MM-DD");
    }.property('deadline'),
    showGracePeriod: function(){
        return moment(this.get('gracePeriod')).format("YYYY-MM-DD");
    }.property('gracePeriod'),

    status_hide: function(){
        return ( this.get('status') === 'hide' );
    }.property('status'),
    viewNotification: function() {
        return ( this.get('status') === 'show' );
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
