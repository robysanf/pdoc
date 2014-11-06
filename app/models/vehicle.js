import DS from 'ember-data';

export default DS.Model.extend({
    registrationYear: DS.attr('date'),

    key:DS.attr('string'),     // company key / name
    name: DS.attr('string'),
    brand: DS.attr('string'),        //marca: iveco
    vehicleModel:  DS.attr('string'),       //modello: Stralis
    type: DS.attr('string'),    //inserito di default utilizzando le sotto-classi
    description: DS.attr('string'),

    configurations: DS.attr('raw'),

    company: DS.belongsTo('company', {
        async: true }),
    //files: DS.hasMany('file'),
    //documents: DS.hasMany('document'),
    //certificationRating: DS.belongsTo('certificationRating'),
    /****************************************************
     * PROPERTIES
     */
    isTruck: function(){
        return this.get('type') === 'truck';
    }.property('type'),
    isTrailer: function(){
        return this.get('type') === 'trailer';
    }.property('type')
});
