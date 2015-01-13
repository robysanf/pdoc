import Ember from 'ember';

export default Ember.ObjectController.extend({
    needs: ['application'],
    app_controller: Ember.computed.alias('controllers.application'),

    view_new_field: false,
    view_totWeight: true,
    mode_view: true,

    new_record: null,
    record_to_delete: null,
    main_record: null,

    type_document: [
       'company',
        'driver',
        'truck',
        'trailer'
    ],
    type_period: [
        'days',
        'months',
        'years'
    ],
//    types: [
//        {name: "Days", id: "days"},
//        {name: "Months", id: "months"},
//        {name: "Years", id: "years"}
//    ],

    //  *** define tab order
    tabList: Ember.A(
        {'general': false},
        {'company': false},
        {'driver': false},
        {'truck': false},
        {'trailer': false}
    )
});
