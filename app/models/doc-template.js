import DS from 'ember-data';
var attr = DS.attr;

export default DS.Model.extend({
    goodsConfiscation: attr('boolean'),    //confisca
    vehicleConfiscation: attr('boolean'),    //sequestro
    fiscalResponsibility: attr('boolean'),   //responsabilità economica
    emas: attr('boolean'),

    isLimited: attr('boolean'),    // se il certificato è scaduto il suo punteggio può arrivare ad un massimo prestabilito

    deadline: attr('custom-time'),         //scadenza

    validityNum: attr('number'),     //durata validità della certificazione
    alertNum: attr('number'),       //quanto tempo prima della scadenza deve essere mostrato l'avviso di scadenza
    graceNum: attr('number'),
    rateValue: attr('number'),      //punteggio da 0-100
    limit: attr('number'),

    name: attr('string'),
    type: attr('string'),          //company/driver/truck/trailer
    validityType: attr('string'),   //days/months/years
    alertType: attr('string'),         //days/months/years
    graceType: attr('string'),      //days/months/years

    company: DS.belongsTo('company', {
        async: true }),
    //models: DS.hasMany('file')
    /***************************************************
     * PROPERTIES
     */
    isCompany: function() {
        return (this.get('type') === 'company' );
    }.property('type'),
    isDriver: function() {
        return (this.get('type') === 'driver' );
    }.property('type'),
    isTruck: function() {
        return (this.get('type') === 'truck' );
    }.property('type'),
    isTrailer: function() {
        return (this.get('type') === 'trailer' );
    }.property('type'),

    setBool: function(){
        if(this.get('goodsConfiscation')){
            this.set('vehicleConfiscation', false);
            this.set('fiscalResponsibility', false);
            this.set('emas', false);
        } else if(this.get('vehicleConfiscation')){
            this.set('goodsConfiscation', false);
            this.set('fiscalResponsibility', false);
            this.set('emas', false);
        }  else if(this.get('fiscalResponsibility')){
            this.set('goodsConfiscation', false);
            this.set('vehicleConfiscation', false);
            this.set('emas', false);
        } else if(this.get('emas')){
            this.set('goodsConfiscation', false);
            this.set('fiscalResponsibility', false);
            this.set('vehicleConfiscation', false);
        }
    }.property('goodsConfiscation', 'vehicleConfiscation', 'fiscalResponsibility', 'emas')
});
