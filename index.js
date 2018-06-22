import 'babel-polyfill';
import inquirer from 'inquirer';

import WC_API from './lib/WC_API';
import WC_Mockery from './lib/WC_Mockery';

const WC_CONSUMER_KEY = process.env.WC_CONSUMER_KEY;
const WC_SECRET_KEY   = process.env.WC_SECRET_KEY;
const WC_SITE_URL     = process.env.WC_SITE_URL;

let questions = [];

if ( ! WC_SITE_URL ) {
	questions.push( {
		type: 'input',
		name: 'wc_site_url',
		message: 'What is your test site URL?'
	} );
}

if ( ! WC_CONSUMER_KEY ) {
	questions.push( {
		type: 'input',
		name: 'wc_consumer_key',
		message: 'What is your WC API Consumer Key?'
	} );
}

if ( ! WC_SECRET_KEY ) {
	questions.push( {
		type: 'input',
		name: 'wc_secret_key',
		message: 'What is your WC API Secret Key?'
	});
}

questions.push( {
	type: 'input',
	name: 'order_qty',
	message: 'How many test orders would you like to create?',
	validate: function( value ) {
		var valid = !isNaN( parseInt(value) );
		return valid || 'Please enter a number';
	},
	filter: Number
} );

questions.push( {
	type: 'input',
	name: 'batch_size',
	message: 'How many orders would you like to create at a time?',
	validate: function( value ) {
		var valid = !isNaN( parseInt(value) );
		return valid || 'Please enter a number';
	},
	filter: Number
} );

inquirer.prompt( questions ).then( answers => {

	const wc_api_params = {
		site_url: answers.wc_site_url || WC_SITE_URL,
		wc_consumer_key: answers.wc_consumer_key || WC_CONSUMER_KEY,
		wc_secret_key: answers.wc_secret_key || WC_SECRET_KEY
	}

	const wc_api     = new WC_API( wc_api_params );
	const wc_mockery = new WC_Mockery( wc_api, answers.batch_size );

	wc_mockery.place_test_orders( answers.order_qty );

} );
