import Ember from 'ember';

export default Ember.ObjectController.extend({
    needs: ['application'],
    app_controller: Ember.computed.alias('controllers.application'),

    mode_view: true,
    //  *** define tab order
    tabList: Ember.A(
        {'paymentDetails': false},
        {'buyCredits': false},
        {'orderHistory': false}
    )
});
