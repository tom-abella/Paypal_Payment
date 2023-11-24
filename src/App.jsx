import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import "./App.css";
const PayPalButton = paypal.Buttons.driver("react", { React, ReactDOM });
import styles from './index.css';
export default function App() {

  const [price, setPrice] = useState(0)

  useEffect(() => {
    const handleWebViewLoad = () => {
      if (window.ReactNativeWebView && window.ReactNativeWebView.injectedObjectJson) {
        const injectedObjectJson = window.ReactNativeWebView.injectedObjectJson();
        if (injectedObjectJson) {
          const customValue = JSON.parse(injectedObjectJson);
          setPrice(customValue.customValue);
        }
        else {
          alert("No data fetch", injectedObjectJson);
        }
      }
    };

    handleWebViewLoad();
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
            // value: 0.5,
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
    <>

        <div className="container">
          <PayPalButton
            className='buttonPaypal'
            createOrder={(data, actions) => _createOrder(data, actions)}
            onApprove={(data, actions) => _onApprove(data, actions)}
            onCancel={() => _onError("CANCELED")}
            onError={() => _onError("ERROR")}
            style={{
              layout: 'vertical', // 'horizontal' or 'vertical'
              color: 'gold', // 'gold', 'blue', 'silver', or 'white'
              shape: 'pill', // 'rect' or 'pill'
              label: 'pay', // 'checkout', 'pay', 'buynow', or 'paypal'
              size: 'large', // 'small', 'medium', 'large', or 'responsive'
            }}
          />
        </div>

    </>

  );
}