import Head from "next/head";

import { useEffect, useState } from "react";
import GooglePayButton from "@/modules/GooglePayButton";

const config = {
  amount: 12.99,
  country: "US",
  currency: "USD",
  gr4vyId: "spider",
  merchantAccountId: "default",
  sandbox: true
};

const Home = () => {
  // Fetch an API token server side
  const [token, setToken] = useState(null);

  useEffect(() => {
    const fetchToken = async () => {
      const response = await fetch(`/api/token?${new URLSearchParams(config)}`);
      const data = await response.json();
      return data.token;
    };

    fetchToken().then((token) => setToken(token));
  }, []);

  // Create a google pay transaction
  const onSuccess = async (googlePayToken) => {
    const baseUrl = `https://api.${config.sandbox ? "sandbox." : ""}${config.gr4vyId}.gr4vy.app`;
    const response = await fetch(`${baseUrl}/transactions`, {
      method: "POST",
      headers: {
        Authorization: `bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: config.amount*100,
        currency: config.currency,
        country: config.country,
        payment_method: {
          method: "googlepay",
          token: googlePayToken,
          redirect_url: "https://example.com"
        },
      }),
    }).then(response => response.json());
    
    console.log(response)
    alert('Transaction successful!')
  };

  return (
    <>
      <Head>
        <title>Sample</title>
        <link rel="icon" href="/favicon.ico" />
        <script
          async
          src="https://pay.google.com/gp/p/js/pay.js">
        </script>
      </Head>
      <main>
        {token && (
          <GooglePayButton
            config={config}
            onSuccess={onSuccess}
          />
        )}
      </main>
    </>
  );
};

export default Home;
