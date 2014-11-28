import Ember from 'ember';

export default Ember.ObjectController.extend({
    needs: ['application'],
    app_controller: Ember.computed.alias('controllers.application'),

    isView: true,

    isView_docList: true,
    isView_docDetails: true,

    main_record: null,
    record_to_delete: null,
    record_certifier: null,
    types: [
        "shipper",
        "carrier",
        "supplier",
        "certifier"
    ],

    documentTypes: [
        "invoice",
        "document",
        "other"
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
