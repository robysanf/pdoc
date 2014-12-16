import Ember from 'ember';

export default Ember.ObjectController.extend({
    needs: ['application'],
    app_controller: Ember.computed.alias('controllers.application'),
    app_controller_companyType: Ember.computed.alias('controllers.application.company_type'),

    is_admin: function(){
        return ( this.get('app_controller_companyType') === 'admin' );
    }.property('app_controller_companyType'),

    mode_view: true,
    //  *** define tab order
    tabList: Ember.A(
        {'paymentDetails': false},
        {'buyCredits': false},
        {'orderHistory': false}
    ),

    cardNumber1: null,
    cardNumber2: null,
    cardNumber3: null,
    cardNumber4: null,

    mm: null,
    yyyy: null,

    cvc: null,

    main_record: null,
    listCurrency: [
        'eur',
        'usd'
    ],
    listType: [
        'certification',
        'service'
    ]
});
