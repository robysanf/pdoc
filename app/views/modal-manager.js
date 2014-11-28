import Ember from 'ember';

export default Ember.View.extend({
    didInsertElement: function() {
        Ember.run.next(this,function(){
            this.$('.modal, .modal-backdrop').addClass('in');
        });
    },

    layoutName: 'modal-layout',
    actions: {
        delete_record: function(outlet, parentView){

            this.controller.send('delete_record');
            this.send( 'close', outlet, parentView);
        },


        close: function(outlet, parentView) {
            var view = this;

            this.$('.modal, .modal-backdrop').one("transitionend", function() {
                view.controller.send( 'close_modal', outlet, parentView );
            });

            this.$('.modal').removeClass('in');
        }
    }
});
