import DS from 'ember-data';
import User from 'p-doc/models/user';

export default User.extend({
    curriculum: DS.attr('string'),

    patents: DS.attr('raw')
});
