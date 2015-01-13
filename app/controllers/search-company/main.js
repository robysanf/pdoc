import Ember from 'ember';

export default Ember.Controller.extend({
    needs: ['application'],
    app_controller: Ember.computed.alias('controllers.application'),

    types_list: [
        "shipper",
        "carrier",
        "supplier",
        "certifier"
    ],

    search_services: null,
    search_type: null,
    search_country: null,
    name: null,

    before_search: false,
    is_loading: false
});
