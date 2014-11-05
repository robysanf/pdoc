import DS from 'ember-data';

export default DS.RESTAdapter.extend({
    //host: 'https://test.zenointelligence.com',
    namespace: "p-doc/api",

    buildURL: function() {
        var token = this.globals.get('token');
        var normalURL = this._super.apply(this, arguments);
        return normalURL + '?token=' + token;
    }
});
