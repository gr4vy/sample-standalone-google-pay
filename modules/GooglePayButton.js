import { useEffect, useState, useRef } from "react";

const GooglePayButton = ({ config, session, onSuccess }) => {
  const [client, setClient] = useState()
  const [readyToPay, setReadyToPay] = useState(false)
  const ref = useRef()

  const baseRequest = {
    apiVersion: 2,
    apiVersionMinor: 0
  };

  // const gatewayMerchantId = `app.gr4vy.${config.sandbox ? 'sandbox.' : ''}${config.gr4vyId}.default`

  const tokenizationSpecification = {
    type: 'PAYMENT_GATEWAY',
    parameters: {
      'gateway': 'gr4vy',
      'gatewayMerchantId': session.gateway_merchant_id
    }
  };

  const allowedCardNetworks = ["AMEX", "MASTERCARD", "VISA"];
  const allowedCardAuthMethods = ["PAN_ONLY", "CRYPTOGRAM_3DS"];

  const baseCardPaymentMethod = {
    type: 'CARD',
    parameters: {
      allowedAuthMethods: allowedCardAuthMethods,
      allowedCardNetworks: allowedCardNetworks
    }
  };
  const allowedPaymentMethods = [baseCardPaymentMethod]

  const cardPaymentMethod = Object.assign(
    {tokenizationSpecification: tokenizationSpecification},
    baseCardPaymentMethod
  );

  useEffect(() => {
    if (google?.payments?.api?.PaymentsClient) {
      const client = new google.payments.api.PaymentsClient({environment: config.sandbox ? "TEST" : "PRODUCTION"});
      setClient(client)
    }
  }, [google?.payments?.api?.PaymentsClient])

  useEffect(() => {
    const isReadyToPayRequest = Object.assign({}, baseRequest);
    isReadyToPayRequest.allowedPaymentMethods = allowedPaymentMethods;

    client && client.isReadyToPay(isReadyToPayRequest)
      .then(response => {
        setReadyToPay(response.result)
      })
      .catch(error => {
        console.error(error);
        setReadyToPay(false)
      })
  }, [client])

  useEffect(() => {
    if (readyToPay) {
      const button = client.createButton({ onClick, allowedPaymentMethods });
      ref.current.appendChild(button);
    }
  }, [readyToPay])

  const onClick = async () => {
    const paymentDataRequest = Object.assign({}, baseRequest);
    paymentDataRequest.allowedPaymentMethods = [cardPaymentMethod];

    paymentDataRequest.transactionInfo = {
      totalPriceStatus: 'FINAL',
      totalPrice: String(config.amount),
      currencyCode: config.currency,
      countryCode: config.country
    };

    // paymentDataRequest.merchantInfo = {
    //   merchantName: 'Sample',
    //   merchantId: gatewayMerchantId
    // };

    paymentDataRequest.merchantInfo = {
      authJwt: session.token,
      merchantId: 'BCR2DN4T7C3KX6DY', 
      merchantName: "Sample",
      merchantOrigin: window.location.hostname,
   },

   console.log(paymentDataRequest)

    client.loadPaymentData(paymentDataRequest).then(paymentData => {
      const paymentToken = paymentData.paymentMethodData.tokenizationData.token;
      onSuccess(paymentToken);
    }).catch(function(err){
      console.error(err);
    });
  };

  return <div ref={ref}></div>;
};

export default GooglePayButton;
