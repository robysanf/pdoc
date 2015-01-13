import Ember from 'ember';

export default Ember.View.extend({
    value: null,
    valueToMatch: null,
    toChange: [],

    focusOut: function(){
        var _this = $('#'+this.toChange);

        if( this.value === '' && this.valueToMatch === '' || this.value === '' && this.valueToMatch === null ){
            _this.addClass("has-error");
        } else {
            if( _this.hasClass("has-error") ){
                _this.removeClass("has-error");
            }
        }
    }
});
