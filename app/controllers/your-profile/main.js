import Ember from 'ember';

export default Ember.ObjectController.extend({
    needs: ['application'],
    app_controller: Ember.computed.alias('controllers.application'),

    app_user_id: Ember.computed.alias('controllers.application.user_id'),
    app_user_type: Ember.computed.alias('controllers.application.user_type'),

    app_company_id: Ember.computed.alias('controllers.application.company_id'),
    app_company_type: Ember.computed.alias('controllers.application.company_type'),
    app_is_linked: Ember.computed.alias('controllers.application.isLinked'),

    is_supplier: function(){
        return ( this.get('app_user_type') === 'supplier' );
    }.property('app_user_type'),

    is_admin_or_clerk: function(){       // l'utente è di tipo admin o clerk
        var type =  this.get('app_user_type');
        return ( type === 'admin' || type === 'clerk' );
    }.property('app_user_type'),

    can_edit_company: function(){         //è admin di questa company se la sua company è uguale alla company loggata
        var user_type = this.get('is_admin_or_clerk');
        var my_company = String(this.get('id')) === String(this.get('app_company_id'));
        return user_type && my_company;
    }.property('app_user_type', 'app_company_id'),

    check_changePassword: function(){
        return (
            String(this.sub_record.get('id')) === String(this.get('app_user_id')) ||
                this.get('is_this_admin')
            );
    }.property('sub_record', 'app_user_id', 'can_edit_company'),

    can_create_doc: function(){
       return ( this.get('app_is_linked') && this.get('is_admin_or_clerk') );        //solo un utente di tipo admin/clerk può creare un document e solo della company proprietaria o di una connessa
    }.property('app_is_linked', 'is_admin_or_clerk'),

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

    documentTypes_supplier: [
        "invoice",
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
