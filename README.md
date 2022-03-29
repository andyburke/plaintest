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

plaintest.run( {
	filter: ( group ) => ( group.name === 'my group' ) )
} );

// or a shortcut filter:
// plaintest.run( {
// 		filter: plaintest.filters.group_name( 'my group' )
// } );
```
