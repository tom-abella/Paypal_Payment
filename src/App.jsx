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

  const onMessage = (event) => {
    try {
      let data = JSON.parse(event.data);
      alert(JSON.stringify(data, null, 2));

      // Your logic here based on the received data
      
      if (data.name) {
        alert(`Hello, ${data.name}!`);
      }
    } catch (error) {
      console.error('Error parsing data:', error);
      // Handle the error as needed
    }
  };

  useEffect(() => {

    window.addEventListener('message', onMessage);

    return () => {
      window.removeEventListener('message', onMessage);
    };
  }, []);

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

  return (
    <div className="container">
      <PayPalButton
        createOrder={(data, actions) => _createOrder(data, actions)}
        onApprove={(data, actions) => _onApprove(data, actions)}
        onCancel={() => _onError("CANCELED")}
        onError={(err) => _onError("ERROE")}
      />
    </div>
  );
}
export default App;