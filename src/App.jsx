import React, { useEffect, useState } from "react";
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

  // useEffect(() => {
  //   // Add an event listener to handle messages sent from React Native
  //   const handleMessage = (event) => {
      
  //     const receivedData = JSON.parse(event.data);
  //     alert('Received data in ReactJS:', receivedData);
  //   };

  //   window.addEventListener('message', handleMessage);
  //   return () => {
  //     window.removeEventListener('message', handleMessage);
  //   };
  // }, []);
  const [price, setPrice] = useState(50);
  const handlePriceChange = () => {
    const newPrice = Math.floor(Math.random() * 100); // Generate a random price for demonstration
    setPrice(newPrice);
    
    // Communicate the new price to React Native
    window.ReactNativeWebView.postMessage(JSON.stringify(newPrice));
  };

  return (
    <div className="container">
      <PayPalButton
        createOrder={(data, actions) => _createOrder(data, actions)}
        onApprove={(data, actions) => _onApprove(data, actions)}
        onCancel={() => _onError("CANCELED")}
        onError={(err) => _onError("ERROR")}
      />
       <div>
      <h1>Product Price: ${price}</h1>
      <button onClick={handlePriceChange}>Change Price</button>
    </div>
    </div>
  );
}
export default App;