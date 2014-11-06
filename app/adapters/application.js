import DS from 'ember-data';

export default DS.RESTAdapter.extend({
    //host: 'http://localhost:3001/',
    //namespace: "seaoracle/api",

    buildURL: function() {
        var token = this.globals.get('token');
        var normalURL = this._super.apply(this, arguments);
        return normalURL + '?token=' + token;
    }
});
