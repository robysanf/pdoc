import DS from 'ember-data';
import Notification from 'p-doc/models/notification';

export default Notification.extend({
    name: DS.attr('string'),

    deadline: DS.attr('date'),
    gracePeriod: DS.attr('date'),

    //documents: DS.hasMany('document', { async: true }),
});
