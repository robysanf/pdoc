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

        change_password: function( curr_pwd, new_pwd, confirm_pwd, outlet, parentView ){
            var view = this, data = this.getProperties();

            data.user = view.controller.sub_record.get('username');
            data.token = view.get('controller.controllers.application').token;
            data.curr_pwd = curr_pwd;
            data.new_pwd = new_pwd;
            data.confirm_pwd = confirm_pwd;

            if( data.new_pwd === data.confirm_pwd ){
                $.post('api/custom/changePassword?token=' + view.get('controller.controllers.application').token, data).then(function(response){
                    if (response.success) {
                        new PNotify({ title: 'Well done', text: 'You successfully changed password.', type: 'success', delay: 2000 });
                    }
                }, function(){
                    new PNotify({ title: 'Warning', text: 'Password incorrect, please check it.', type: 'error', delay: 2000 });
                });
            }else{
                new PNotify({ title: 'Warning', text: 'The new passwords do not match, please check them.', type: 'error', delay: 2000 });
            }
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
