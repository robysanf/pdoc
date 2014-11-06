import DS from 'ember-data';
import Notification from 'p-doc/models/notification';

export default Notification.extend({
    name: DS.attr('string')
});
