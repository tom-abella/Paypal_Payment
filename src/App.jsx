import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import "./App.css";
const PayPalButton = window.paypal.Buttons.driver("react", { React, ReactDOM });
function App() {
  const [price, setPrice] = useState(0)
  function _createOrder(data, actions) {
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: parseFloat(price),
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
    const handleWebViewLoad = () => {
      if (window.ReactNativeWebView && window.ReactNativeWebView.injectedObjectJson) {
        const injectedObjectJson = window.ReactNativeWebView.injectedObjectJson();
        if (injectedObjectJson) {
          const customValue = JSON.parse(injectedObjectJson);
          setPrice(customValue.customValue)
          alert(customValue.customValue)
        }
        else{
          alert("No data fetch", injectedObjectJson)
        }
      }
    };
    handleWebViewLoad()

    window.onload = handleWebViewLoad;

    // Cleanup the event listener when the component unmounts
    return () => {
      window.onload = null;
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