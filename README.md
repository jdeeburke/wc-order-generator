WC Order Tester
===============
A command-line utility for creating test orders on a WooCommerce site via the WC REST API.

`npm run start`

You will be prompted for your `Site URL`, `API Consumer Key` and `API Secret Key`.

You can also set these in your environment so you won't be prompted every time:
```
export WC_SITE_URL="https://mysite.test"
export WC_CONSUMER_KEY="ck_****************************************"
export WC_SECRET_KEY="cs_****************************************"
```

Next, you'll be prompted for:

* How many test orders do you want to create?
* How many async API requests to perform per batch? (10 or so seems to work well for a local site)

Each order will contain:

* Generated names
* Generated billing and shipping addresses (does not validate)
* A payment gateway chosen at random based on what is enabled on the site
* 1-5 line items selected randomly from all products on the site, each with a quantity between 1-5.
* Shipping will always be $5.00 flat-rate (or whichever currency the site is set to use)
