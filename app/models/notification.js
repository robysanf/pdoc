import DS from 'ember-data';

export default DS.Model.extend({
    highlighted: DS.attr('boolean'),

    date: DS.attr('date'),

    detail: DS.attr('string'),
    fromCompanyDetails: DS.attr('string'),
    fromUserDetails: DS.attr('string'),
    status: DS.attr('string'), //view/hide
    type: DS.attr('string'), //deadline/rating/link/certification

    company: DS.belongsTo('company', {
        async: true }),

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
