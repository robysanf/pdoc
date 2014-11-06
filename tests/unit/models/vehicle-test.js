import {
  moduleForModel,
  test
} from 'ember-qunit';

moduleForModel('vehicle', 'Vehicle', {
  // Specify the other units that are required for this test.
  needs: []
});

test('it exists', function() {
  var model = this.subject();
  // var store = this.store();
  ok(!!model);
});
