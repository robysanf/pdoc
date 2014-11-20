import DS from 'ember-data';

export default DS.Model.extend({
    registrationYear: DS.attr('custom-time'),

    weight: DS.attr('number'),  //peso complessivo
    tare: DS.attr('number'),

    chassisNumber: DS.attr('string'),
    brand: DS.attr('string'),        //marca: iveco
    category: DS.attr('string'),   //euro1, euro2, ... euro6
    description: DS.attr('string'),
    key:DS.attr('string'),     // company key / name
    type: DS.attr('string'),    // truck/trailer
    name: DS.attr('string'),
    vehicleModel:  DS.attr('string'),       //modello: Stralis

    configurations: DS.attr('raw'),

    company: DS.belongsTo('company', {
        async: true }),
    //files: DS.hasMany('file'),
    //documents: DS.hasMany('document'),
    //certificationRating: DS.belongsTo('certificationRating'),

    /**************************  PROPERTIES  **************************/
    isTruck: function(){
        return this.get('type') === 'truck';
    }.property('type'),
    isTrailer: function(){
        return this.get('type') === 'trailer';
    }.property('type')
});

