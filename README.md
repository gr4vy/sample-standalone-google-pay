# Sample: Standalone Google Pay on web

## Testing the sample

To run this sample please perform the following steps.

<details>

<summary>Instructions</summary>

### Preparation

- Create an API key in your Gr4vy dashboard and save it as `./private_key.pem`
- Change any of the config values in `pages/index.js` to define your `gr4vyId`, `environment`, and `merchantAccountId`
- Install Node `v18` or above as well as the dependencies for this project
  - Run `npm install`
- Start the server with `npm run dev`

### Running on HTTPS

Next, it's possible to run the sample on HTTPs. We recommend using a free tool like [Ngrok](https://ngrok.com).

- Expose your site over HTTPs with `ngrok`
  - Run `ngrok http 3000`
  - This exposes your site on an Ngrok domain, for example `https://40be-88-97-18-163.ngrok.io`

### Test a payment

Finally, it's time to test a payment.

- Ensure you have a connector set up for the currency and amount, and that it supports Google Pay
- Open the Ngrok domain in your browser on a desktop, Apple, or Android device

</details>

## How it works

This document follows the [Google tutorial on Google Pay](https://developers.google.com/pay/api/web/guides/tutorial). It implements most of the 
Google Pay specifics inside the `modules/GooglePayButton.js` file. The actual Gr4vy integration lives inside the `pages/index.js` for the frontend
code, and `pages/api/token.js` for the backend code.