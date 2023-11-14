import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import "./App.css";
const PayPalButton = window.paypal.Buttons.driver("react", { React, ReactDOM });
function App() {
  function _createOrder(data, actions) {
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: "1",
          },
        },
      ],
    });
  }
  async function _onApprove(data, actions) {
    let order = await actions.order.capture();
    console.log(order);
    window.ReactNativeWebView &&
      window.ReactNativeWebView.postMessage(JSON.stringify(order));
    return order;
  }
  function _onError(err) {
    console.log(err);
    let errObj = {
      err: err,
      status: "FAILED",
    };
    window.ReactNativeWebView &&
      window.ReactNativeWebView.postMessage(JSON.stringify(errObj));
  }

  useEffect(() => {
    // Add an event listener to handle messages sent from React Native
    const handleMessageFromReactNative = event => {
      const receivedData = JSON.parse(event.data);
      alert('Received data in React JS:', receivedData);
     

      // Do something with the received data
      // For example, update the state or perform other actions
    };

    window.addEventListener('message', handleMessageFromReactNative);

    // Cleanup the event listener when the component unmounts
    return () => {
      window.removeEventListener('message', handleMessageFromReactNative);
    };
  }, []);


  return (
    <div className="container">
      <PayPalButton
        createOrder={(data, actions) => _createOrder(data, actions)}
        onApprove={(data, actions) => _onApprove(data, actions)}
        onCancel={() => _onError("CANCELED")}
        onError={(err) => _onError("ERROR")}
      />
    </div>
  );
}
export default App;