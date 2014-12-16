import Ember from 'ember';

export default Ember.ObjectController.extend({
    needs: ['application'],
    app_controller: Ember.computed.alias('controllers.application'),

    isView: true,
    status_hide: false,

    selectedRecord: null,

    //  *** define tab order
    tabList: Ember.A(
        {'general': false},
        {'linksRequest': false}
    ),

    bool: [
        true,
        false
    ]
});
