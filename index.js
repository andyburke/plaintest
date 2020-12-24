'use strict';

let headline = 'test';
const groups = [];

module.exports = {
	headline: function( _headline ) {
		headline = _headline;
	},

	test: function( name, test ) {
		if ( Array.isArray( this.tests ) ) {
			this.tests.push( {
				name,
				test
			} );
		}
		else {
			let group = groups[ groups.length - 1 ];
			if ( !group ) {
				group = module.exports.group();
			}

			group.test( name, test );
		}
	},

	group: function( name ) {
		const group = {
			name,
			tests: [],
			before: {
				each: [],
				all: []
			},
			after: {
				each: [],
				all: []
			}
		};

		group.test = module.exports.test.bind( group );

		groups.push( group );

		return group;
	},

	run: async function() {

		let count = 0;
		let failed = 0;

		const total_tests = groups.reduce( ( _total_tests, group ) => ( _total_tests + group.tests.length ), 0 );

		console.log( `# ${ headline }` );
		console.log( `1..${ total_tests }` );

		for ( const group of groups ) {

			if ( !group.tests.length ) {
				continue;
			}

			if ( typeof group.name === 'string' ) {
				console.log( `#   ${ group.name }` );
			}

			for ( const before_all of group.before.all ) {
				await before_all();
			}

			for ( const test of group.tests ) {
				try {
					++count;
					for ( const before_each of group.before.each ) {
						await before_each();
					}

					await test.test();

					console.log( `ok ${ count } ${ test.name }` );

					for ( const after_each of group.after.each ) {
						await after_each();
					}
				}
				catch ( ex ) {
					++failed;
					console.log( `not ok ${ count } ${ test.name }` );
					console.log( ( ex.stack ? ex.stack.toString() : ex.toString() ).split( '\n' ).map( ( line ) => `  ${ line }` ).join( '\n' ) );
				}
			}

			for ( const after_all of group.after.all ) {
				await after_all();
			}
		}

		return failed === 0;
	}
};