import Ember from 'ember';

export default Ember.ObjectController.extend({
    needs: ['application'],
    app_controller: Ember.computed.alias('controllers.application'),

    app_user_id: Ember.computed.alias('controllers.application.user_id'),
    app_user_type: Ember.computed.alias('controllers.application.user_type'),

    app_company_id: Ember.computed.alias('controllers.application.company_id'),
    app_company_type: Ember.computed.alias('controllers.application.company_type'),
    app_is_linked: Ember.computed.alias('controllers.application.isLinked'),

    is_admin: function(){
        return ( this.get('app_user_type') === 'admin');
    }.property('app_user_type'),

    is_certifier: function() {
        return ( this.get('app_company_type') === 'certifier' );
    }.property('app_company_type'),

    is_driver: function(){
        return ( this.get('app_user_type') === 'driver' );
    }.property('app_user_type'),

    is_supplier: function(){     //nella creazione di documenti, per decidere se far vedere la lista completa o solo 'other' and 'invoice'
        return ( this.get('app_company_type') === 'supplier' );
    }.property('app_company_type'),

    is_driver_and_canEdit: function(){
        return ( this.get('is_driver') && String(this.get('sub_record').get('id')) === String(this.get('app_user_id')) );
    }.property('is_driver', 'id', 'sub_record', 'app_user_id'),

    is_admin_or_clerk: function(){       // l'utente è di tipo admin o clerk
        var type =  this.get('app_user_type');
        return ( type === 'admin' || type === 'clerk' );
    }.property('app_user_type'),

    is_admin_for_this_company: function(){
        var my_company = String(this.get('id')) === String(this.get('app_company_id'));
        return  this.get('is_admin') && my_company ;
    }.property('is_admin', 'app_company_id', 'id'),

    can_edit_company: function(){         //è admin di questa company se la sua company è uguale alla company loggata
        var user_type = this.get('is_admin_or_clerk');
        var my_company = String(this.get('id')) === String(this.get('app_company_id'));
        return user_type && my_company ;
    }.property('is_admin_or_clerk', 'app_company_id', 'id'),

    canEdit: function(){
        return this.get('sub_record_document').get('canEdit');
    }.property('sub_record_document'),

    canEdit_companyDocument: function(){
        return this.get('record_isNew') || this.get('canEdit');
    }.property('record_isNew', 'canEdit'),

    canEdit_userProfile: function(){         //è admin di questa company se la sua company è uguale alla company loggata
        return this.get('record_isNew') || this.get('is_driver_and_canEdit') || this.get('can_edit_company') ;
    }.property('record_isNew', 'is_driver_and_canEdit', 'can_edit_company'),

    check_changePassword: function(){
        if( this.sub_record ){
            return ( String(this.sub_record.get('id')) === String(this.get('app_user_id')) || this.get('is_admin_for_this_company') );
        }
    }.property('sub_record', 'app_user_id', 'can_edit_company'),

    canCreate_subRecord_doc: function(){
        return ( this.get('app_is_linked') && this.get('is_admin_or_clerk') || this.get('is_driver_and_canEdit') );
    }.property( 'app_is_linked', 'is_admin_or_clerk', 'is_driver_and_canEdit' ),

    can_create_doc: function(){
        var isLink = this.get('app_is_linked');
        var hadPermission = this.get('is_admin_or_clerk');
       return ( isLink && hadPermission );        //solo un utente di tipo admin/clerk può creare un document e solo della company proprietaria o di una connessa
    }.property('app_is_linked', 'is_admin_or_clerk'),

    isView: true,

    isView_logo: true,
    isView_docList: true,
    isView_docDetails: true,

    rating_type: null,
    companyRecord: null,
    sub_record_company: null,

    main_record: null,
    record_to_delete: null,
    record_certifier: null,
    record_type: null,
    record_isNew: false,

    newRecordClerk: function(){
        return this.get('record_type') === 'clerk';
    }.property('record_type'),
    newRecordDriver: function(){
        return this.get('record_type') === 'driver';
    }.property('record_type'),
    newRecordTruck: function(){
        return this.get('record_type') === 'truck';
    }.property('record_type'),
    newRecordTrailer: function(){
        return this.get('record_type') === 'trailer';
    }.property('record_type'),

    newRecordUser: function(){
        return this.get('record_type') === 'clerk' || this.get('record_type') === 'driver' ;
    }.property('record_type'),
    newRecordVehicle: function(){
        return this.get('record_type') === 'trailer' || this.get('record_type') === 'truck' ;
    }.property('record_type'),

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
    sub_record_document: null,

    /****************************************
     * NUOVI RECORD
     * */
    newConfigurations: [],
    newLanguages: [],
    newPatents: [],
    newFirstName: null,
    newLastName: null,
    newBirthDate: null,
    newPhone: null,
    newSkype: null,
    newEmail: null,
    newUsername: null,
    newPassword: null,

    newName: null,
    newBrand: null,
    newModel: null,
    newDescription: null,
    newRegistrationYear: null,
    newChassisNumber: null,
    newWeight: null,
    newTare: null,
    newCategory: null,

    /** change pwd */
    curr_pwd: null,
    new_pwd: null,
    confirm_pwd: null
 });
