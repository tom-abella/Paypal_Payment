import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import "./App.css";
const PayPalButton = paypal.Buttons.driver("react", { React, ReactDOM });
import LoadingView from "./Loading";
export default function App() {

  const [price, setPrice] = useState(0)
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true)
    const handleWebViewLoad = () => {
      if (window.ReactNativeWebView && window.ReactNativeWebView.injectedObjectJson) {
        const injectedObjectJson = window.ReactNativeWebView.injectedObjectJson();
        if (injectedObjectJson) {
          const customValue = JSON.parse(injectedObjectJson);
          setPrice(customValue.customValue)
        }
        else {
          alert("No data fetch", injectedObjectJson)
        }
      }
      setLoading(false)
    };
    handleWebViewLoad()
    window.onload = handleWebViewLoad;
    return () => {
      window.onload = null;
    };
  }, []);

  const _createOrder = (data, actions) => {
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

  const _onApprove = async (data, actions) => {
    let order = await actions.order.capture();
    console.log(order);
    window.ReactNativeWebView &&
      window.ReactNativeWebView.postMessage(JSON.stringify(order));
    return order;
  }

  const _onError = (err) => {
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
        onError={(err) => _onError("ERROR")}
      />
      {loading && (
        <LoadingView />
      )}
    </div>
  );
}