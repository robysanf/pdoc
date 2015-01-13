import DS from 'ember-data';

export default DS.Model.extend({
    canEdit: DS.attr('boolean'),
    canRemove: DS.attr('boolean'),

    registrationYear: DS.attr('custom-date'),

    weight: DS.attr('number'),  //peso complessivo
    tare: DS.attr('number'),
    certificationScore:DS.attr('number'),

    brand: DS.attr('string'),        //marca: iveco
    category: DS.attr('string'),   //euro1, euro2, ... euro6
    chassisNumber: DS.attr('string'),
    description: DS.attr('string'),
    key:DS.attr('string'),     // company key / name
    name: DS.attr('string'),
    type: DS.attr('string'),    // truck/trailer
    vehicleModel:  DS.attr('string'),       //modello: Stralis


    vehicleConfigurations: DS.attr('raw'),

    company: DS.belongsTo('company', {
        async: true }),
    files: DS.hasMany('files', {
        async: true}),
    documents: DS.hasMany('document', {
        async: true}),
    ratings: DS.hasMany('rating', {
        async: true}),
    /**************************  PROPERTIES  **************************/
    totalCertificationRating: function(){
        var totRatings = 0, ratings = this.get('ratings');

        ratings.forEach( function(val) {
            if(val.get('type') === 'certification'){
                totRatings += 1;
            }
        });

        return totRatings;
    }.property('ratings.@each.type'),
    isTruck: function(){
        return this.get('type') === 'truck';
    }.property('type'),
    isTrailer: function(){
        return this.get('type') === 'trailer';
    }.property('type')
});

