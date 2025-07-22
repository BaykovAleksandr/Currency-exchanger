import React, { useState, useEffect } from "react";
import "./index.css";

//https://api.frankfurter.app/latest?amount=100&from=EUR&to=USD

const API_URL = "https://api.frankfurter.app/";

function App() {
  const [currencies, setCurrencies] = useState([]);
  const [fromCurrency, setFromCurrency] = useState("EUR");
  const [toCurrency, setToCurrency] = useState("USD");
  const [amount, setAmount] = useState(0);
  const [convertedAmount, setConvertedAmount] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function getCurrencies() {
      try {
        const res = await fetch(`${API_URL}latest`);
        const data = await res.json();
        setCurrencies(Object.keys(data.rates));
      } catch {
        setError("Failed to fetch currencies");
      }
    }
    getCurrencies();
  }, []);

  async function handleConvert() {
    if (!amount || amount <= 0) {
      setError("Amount must be greater than zero");
      return;
    }
    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch(
        `${API_URL}latest?amount=${amount}&from=${fromCurrency}&to=${toCurrency}`
      );

      const data = await res.json();

      setConvertedAmount(data.rates[toCurrency]);
    } catch {
      setError("Failed to convert currencies");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="app">
      <h1>Currency Exchange Calculator</h1>

      <div className="converter-container">
        {error && <p className="error">{error}</p>}

        <div className="input-group">
          <input
            value={amount}
            onChange={(evt) => setAmount(evt.target.value)}
            type="number"
            placeholder="Amount"
            className="input-field"
          />
          <select
            value={fromCurrency}
            onChange={(evt) => setFromCurrency(evt.target.value)}
            className="dropdown"
          >
            {currencies.map((item) => (
              <option value={item} key={item}>
                {item}
              </option>
            ))}
          </select>
          <span className="arrow">→</span>
          <select
            value={toCurrency}
            onChange={(evt) => setToCurrency(evt.target.value)}
            className="dropdown"
          >
            {currencies.map((item) => (
              <option value={item} key={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
        <button
          disabled={isLoading}
          className="convert-button"
          onClick={handleConvert}
        >
          Convert
        </button>
        {isLoading && <p className="loading">Converting...</p>}
        {convertedAmount !== null && !isLoading && (
          <p className="result">
            {convertedAmount} {toCurrency}
          </p>
        )}
      </div>
    </div>
  );
}

export default App;
