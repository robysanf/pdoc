import DS from 'ember-data';

export default DS.RESTAdapter.extend({
    //host: 'http://localhost:3001/',
    namespace: "p-doc/api",

    buildURL: function() {
        var token_pdoc = this.app_init.get('token_pdoc');
        var normalURL = this._super.apply(this, arguments);
        return normalURL + '?token=' + token_pdoc;
    }
});
