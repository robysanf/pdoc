import Ember from 'ember';

export default Ember.ObjectController.extend({
    needs: ['application'],
    app_controller: Ember.computed.alias('controllers.application'),
    app_user_id: Ember.computed.alias('controllers.application.user_record'),
    app_company_type: Ember.computed.alias('controllers.application.company_type'),


    is_admin: function(){
       return this.get('app_user_id').get('profile') === 'admin';
    }.property('app_user_id'),
    check_changePassword: function(){
        return ( String(this.sub_record.get('id')) === String(this.get('app_user_id')) || this.get('is_admin') );
    }.property('sub_record', 'app_user_id', 'is_admin'),


    isView: true,

    isView_logo: true,
    isView_docList: true,
    isView_docDetails: true,

    rating_type: null,

    main_record: null,
    record_to_delete: null,
    record_certifier: null,
    types: [
        "shipper",
        "carrier",
        "supplier",
        "certifier"
    ],
    image_url: null,

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

    sub_record: null,
    sub_record_document: null
});
