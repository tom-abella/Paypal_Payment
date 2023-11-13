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

  const [receivedData, setReceivedData] = useState(null);

  useEffect(() => {
    // Add an event listener to handle messages sent from React Native
    const handleMessage = (event) => {
      // Handle messages sent from React Native
      const data = event.data;

      try {
        const parsedData = JSON.parse(data);
        // Update state with the received data
        setReceivedData(parsedData);
      } catch (error) {
        console.error('Error parsing received data:', error);
      }
    };

    window.addEventListener('message', handleMessage);

    // Clean up the event listener when the component is unmounted
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  return (
    <div className="container">
      {receivedData && (
        <div>
          <p>Received data in ReactJS:</p>
          <pre>{JSON.stringify(receivedData, null, 2)}</pre>
        </div>
      )}
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