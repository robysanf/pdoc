import Ember from 'ember';

export default Ember.View.extend({
    didInsertElement: function() {
        var view = this, controller = this.get('controller');

        var fileinput = $('.fileinput').fileinput();

        fileinput.on('change.bs.fileinput', function(e, files){
            //cancello immagini salvate precedentemente
            view.get('controller.controllers.application').formData_size = null;
            view.get('controller.controllers.application').formData = new FormData();
            //salvo nuova immagine
            view.get('controller.controllers.application').formData_size = files.size;
            view.get('controller.controllers.application').formData.append("file", files);
        });

        fileinput.on('clear.bs.fileinput', function(e){
            view.get('controller.controllers.application').formData_size = null;
            view.get('controller.controllers.application').formData = new FormData();
        });

    }
});
