import https from 'https';
import axios from 'axios';
import util from 'util';

module.exports = class WC_API {

	constructor( params ) {
		this.site_url        = params.site_url;
		this.wc_consumer_key = params.wc_consumer_key;
		this.wc_secret_key   = params.wc_secret_key;

		this.api_url = this.site_url.replace(/\/$/, '') + '/wp-json/wc/v2/';
		this.config  = {
			auth: {
				username: this.wc_consumer_key,
				password: this.wc_secret_key
			},
			httpsAgent: new https.Agent({ rejectUnauthorized: false })
		}
	}

	async get_products() {
		console.log( "Fetching products from API..." );
		try {

			const response = await axios.get( this.api_url + 'products', this.config );
			return response.data;

		} catch ( e ) {

			console.log( 'get_products: ', e );
			return;
		}
	}

	async get_gateways() {
		console.log( "Fetching gateways from API..." );
		try {

			const response = await axios.get( this.api_url + 'payment_gateways', this.config );
			return response.data;

		} catch ( e ) {

			console.log( 'get_products: ', e );
			return;
		}
	}

	async place_order( order_data ) {

		try {

			const response = await axios.post( this.api_url + 'orders', order_data, this.config )
			return response.data;

		} catch ( e ) {

			console.log( 'place_order error:' );

			if ( e.response ) {
				console.log( e.response.data );
			} else {
				console.log( e.message );
			}

			return;
		}

		return 'success';
	}
}
