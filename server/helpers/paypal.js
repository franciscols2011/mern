const paypal = require("paypal-rest-sdk");

paypal.configure({
	mode: "sandbox",
	client_id:
		"AbSPn72EsINhgO5RK8nM6cubT2gDkdrjOj0FRkpM7X6yE9BYc1ePgSJkYnangJpmchoV_TB75SSeHSl_",
	client_secret:
		"EEbP35SPODQmsVRN8KsAbJoOeoFWJSo9vk0u7KcGnr09D92nV8QH6m1pHY4z_kKq7N7KLs3Sv45-kiWx",
});

module.exports = paypal;
