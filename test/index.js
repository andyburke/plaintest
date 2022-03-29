'use strict';

const assert = require( 'assert' );
const plaintest = require( '..' );

plaintest.headline( 'plaintest' );

plaintest.test( 'calling .test() without a group will add a group', () => {
	assert.ok( true );
} );

const group_one = plaintest.group( 'group one' );
group_one.test( 'groups allow adding tests', () => {
	assert.ok( true );
} );

const group_two = plaintest.group( 'group two' );
group_two.test( 'multiple groups are supported', () => {
	assert.ok( true );
} );

const group_to_skip = plaintest.group( 'skip this group' );
group_to_skip.test( 'skipped group tests should not run', () => {
	assert.ok( false );
} );

const group_to_skip_with_common_filter = plaintest.group( 'skip by common filter' );
group_to_skip_with_common_filter.test( 'skipped group tests should not run', () => {
	assert.ok( false );
} );

const solo_group = plaintest.group( 'solo group' );
solo_group.test( 'should be ok to run this group', () => {
	assert.ok( true );
} );

let before_each_count = 0;
const group_before_each = plaintest.group( 'group with before each' );
group_before_each.before.each.push( () => {
	++before_each_count;
} );

group_before_each.test( 'test one (before each)', () => {
	assert.strictEqual( before_each_count, 1 );
} );

group_before_each.test( 'test two (before each)', () => {
	assert.strictEqual( before_each_count, 2 );
} );

let after_each_count = 0;
const group_after_each = plaintest.group( 'group with after each' );
group_after_each.after.each.push( () => {
	++after_each_count;
} );

group_after_each.test( 'test one (after each)', () => {
	assert.strictEqual( after_each_count, 0 );
} );

group_after_each.test( 'test two (after each)', () => {
	assert.strictEqual( after_each_count, 1 );
} );

let before_all_count = 0;
const group_before_all = plaintest.group( 'group with before all' );
group_before_all.before.all.push( () => {
	++before_all_count;
} );

group_before_all.test( 'test one (before all)', () => {
	assert.strictEqual( before_all_count, 1 );
} );

group_before_all.test( 'test two (before all)', () => {
	assert.strictEqual( before_all_count, 1 );
} );

let after_all_count = 0;
const group_after_all = plaintest.group( 'group with after all' );
group_after_all.after.all.push( () => {
	++after_all_count;
} );

group_after_all.test( 'test one (after all)', () => {
	assert.strictEqual( after_all_count, 0 );
} );

group_after_all.test( 'test two (after all)', () => {
	assert.strictEqual( after_all_count, 0 );
} );

plaintest.test( 'later tests are added to the last group created', () => {
	assert.ok( true );
} );

( async function() {
	await plaintest.run( {
		filter: ( group ) => ( !/skip/i.test( group.name ) )
	} );

	assert.strictEqual( after_all_count, 1 );

	before_all_count = 0;
	after_all_count = 0;
	before_each_count = 0;
	after_each_count = 0;
	await plaintest.run( {
		filter: plaintest.filters.skip_group_names( [ 'skip this group', 'skip by common filter' ] )
	} );

	before_all_count = 0;
	after_all_count = 0;
	before_each_count = 0;
	after_each_count = 0;
	await plaintest.run( {
		filter: plaintest.filters.group_name( 'solo group' )
	} );

} )();