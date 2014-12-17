import DS from 'ember-data';

export default DS.Model.extend({
    canEdit: DS.attr('boolean'),
    canRemove: DS.attr('boolean'),
    highlighted: DS.attr('boolean'),

    date: DS.attr('custom-date'),
    deadline: DS.attr('custom-date'),
    gracePeriod: DS.attr('custom-date'),

    actionToken: DS.attr('string'),
    detail: DS.attr('string'),
    description: DS.attr('string'),
    entity: DS.attr('string'),
    entityType: DS.attr('string'),
    fromCompanyDetail: DS.attr('string'),
    fromUserDetail: DS.attr('string'),
    name: DS.attr('string'),
    status: DS.attr('string'), //show/hide
    type: DS.attr('string'),    // deadline/  (no action)
                                // link/
                                // certificationRating/serviceRating/
                                // newRating (no action)

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

    isServiceRating: function() {
        return ( this.get('type') === 'serviceRating' );
    }.property('type'),
    isDeadline: function() {
        return ( this.get('type') === 'deadline' );
    }.property('type'),
    isLink: function() {
        return ( this.get('type') === 'link' );
    }.property('type'),
    isCredit: function() {
        return ( this.get('type') === 'credit' );
    }.property('type'),
    isNewRating: function() {
        return ( this.get('type') === 'newRating' );
    }.property('type'),
    isCertificationRating: function() {
        return ( this.get('type') === 'certificationRating' );
    }.property('type')

});
