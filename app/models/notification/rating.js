import DS from 'ember-data';
import Notification from 'p-doc/models/notification';

export default DS.Model.extend({
    name: DS.attr('string'),

    valueNum: DS.attr('number')
});
