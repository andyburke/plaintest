# plaintest

## example

```javascript
const assert = require( 'assert' );
const plaintest = require( 'plaintest' );

plaintest.test( 'this is a test', () => {
	assert.ok( true );
} );

const my_group = plaintest.group( 'my group' );
my_group.test( 'this is a test in "my group"', () => {
	assert.ok( true );
} );
```
