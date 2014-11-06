import DS from 'ember-data';
import Notification from 'p-doc/models/notification';

export default DS.Model.extend({
    fromCompany: DS.belongsTo('company', {
        async: true }),
    fromUser: DS.belongsTo('user', {
        polymorphic: true,
        async: true })
});
