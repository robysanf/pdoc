import Ember from 'ember';

export default Ember.ObjectController.extend({
    needs: ['application'],
    app_controller: Ember.computed.alias('controllers.application'),

    isView: true,

    isView_docList: true,
    isView_docDetails: true,

    main_record: null,
    record_to_delete: null,

    types: [
        {name: "Shipper", id: "Shipper"},
        {name: "Carrier", id: "Carrier"},
        {name: "Supplier", id: "Supplier"},
        {name: "Certifier", id:"Certifier"}
    ],

    //  *** define tab order
    tabList: Ember.A(
        {'company': false},
        {'driver': false},
        {'truck': false},
        {'trailer': false},
        {'clerk': false}
    ),

   /***************************************
    * DRIVERS - TAB
    * */

    transition_to_list: true,

    sub_record: null
});
