import Ember from 'ember';

export default Ember.View.extend({
    didInsertElement: function() {
        $(function () {
            $('[data-toggle="tooltip"]').tooltip();
        });
    }

});
