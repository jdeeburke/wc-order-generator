import mocker from 'mocker-data-generator'

module.exports = class WC_Mockery {

	constructor( wc_api, batch_size ) {
		this.api = wc_api
		this.batch_size = batch_size
	}


	async get_products() {
		if ( ! this.products ) {
			this.products = await this.api.get_products();
		}

		return await this.products;
	}

	async get_gateways() {
		if ( ! this.gateways ) {
			this.gateways = await this.api.get_gateways();
		}

		return await this.gateways;
	}

	async place_test_orders( qty ) {

		await this.get_products();
		await this.get_gateways();

		let batches = 1;
		let overall_total = 0;
		const batch_mod = qty % this.batch_size;

		if ( this.batch_size < qty && this.batch_size > 0 ) {
			batches = batch_mod > 0 ? ( parseInt( qty / this.batch_size ) + 1 ) : parseInt( qty / this.batch_size );
		}

		for ( let batch = 1; batch <= batches; batch++ ) {

			let resultPromises = [];
			let this_batch_size = this.batch_size;

			if ( batch == batches && batch_mod > 0 ) {
				this_batch_size = batch_mod;
			}

			for ( let i = 0; i < this_batch_size; i++ ) {
				resultPromises.push( this.place_test_order() );
			}

			const s   = resultPromises.length == 1 ? "" : "s";
			overall_total += resultPromises.length;
			const pct = parseInt( overall_total / qty * 10000 ) / 100.00;

			console.log( "Creating " + resultPromises.length + " Order" + s + "... (" + overall_total + "/" + qty + " - " + pct + "%)" );

			const results = await Promise.all( resultPromises );
		}

		// for ( let i = 0; i < qty; i = i + this.batch_size ) {
		// 	const result = await this.place_test_order();
		// 	const pct    = parseInt( (i+1) / qty * 100 );
		// 	process.stdout.write( " Creating " + ( i + 1 ) + " of " + qty + " Orders... (" + pct + "%)\r" );
		// }

		process.stdout.write( "\nAll Done!" );
	}

	async place_test_order() {

		const test_order_data = await this.generate_test_order_data();

		const result = await this.api.place_order( test_order_data.orders.shift() );

		return await result;
	}

	async generate_test_order_data() {

		const products = await this.get_products();
		const gateways = await this.get_gateways();

		const order = {
			payment_method: {
				function: function() {
					return this.faker.random.arrayElement(gateways).id;
				}
			},
			payment_method_title: {
				function: function() {
					for (let gateway of gateways) {
						if ( this.object.payment_method == gateway.id ) {
							return gateway.title;
						}
					}
					return '';
				}
			},
			set_paid: {
				static: true
			},
			billing: {
				function: function() {
					return {
						first_name: this.faker.name.firstName(),
						last_name: this.faker.name.lastName(),
						address_1: this.faker.address.streetAddress(),
						address_2: this.faker.address.secondaryAddress(),
						city: this.faker.address.city(),
						state: this.faker.address.stateAbbr(),
						postcode: this.faker.address.zipCode(),
						country: this.faker.address.countryCode(),
						email: this.faker.internet.email(),
						phone: this.faker.phone.phoneNumber()
					};
				}
			},
			shipping: {
				self: 'billing'
			},
			line_items: [
				{
					function: function() {
						return {
							product_id: this.faker.random.arrayElement(products).id,
							quantity: this.chance.integer( {
								'min': 1,
								'max': 5
							} )
						}
					},
					length: 5
				}
			],
			shipping_lines: [
				{
					function: function() {
						return {
							"method_id": "flat_rate",
							"method_title": "Flat Rate",
							"total": "5"
						};
					},
					length: 1,
					fixedLength: true
				}
			]
		};

		return mocker()
			.schema( 'orders', order, 1 )
			.build()
	}

}
