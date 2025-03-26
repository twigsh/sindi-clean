
import { useEffect, useState } from "react";

export default function Home() {
  const [amount, setAmount] = useState(1000);
  const [rateData, setRateData] = useState(null);
  const [converted, setConverted] = useState(0);

  const pairs = [
    { from: "RUB", to: "CNY" },
    { from: "RUB", to: "THB" },
    { from: "RUB", to: "TRY" },
    { from: "RUB", to: "AED" },
    { from: "RUB", to: "USDT" },
  ];

  useEffect(() => {
    const fetchRates = async () => {
      const fiat = await fetch("https://api.exchangerate.host/latest?base=RUB&symbols=CNY,THB,TRY,AED").then(res => res.json());
      const crypto = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=tether&vs_currencies=rub").then(res => res.json());

      const usdtRate = 1 / crypto.tether.rub;

      setRateData({
        ...fiat.rates,
        USDT: usdtRate
      });
    };
    fetchRates();
  }, []);

  useEffect(() => {
    if (rateData) {
      const rate = rateData["CNY"];
      setConverted((amount * rate * 0.99).toFixed(2));
    }
  }, [amount, rateData]);

  return (
    <main style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Сервис обмена валют и криптовалют</h1>
      <h2>Онлайн-конвертер</h2>
      <div>
        <input type="number" value={amount} onChange={e => setAmount(+e.target.value)} /> ₽ → 
        <input type="text" value={converted} readOnly /> ¥
      </div>
      <h2>Курсы с 1% накруткой</h2>
      <ul>
        {pairs.map(({ from, to }) => {
          const rate = rateData?.[to];
          const adjusted = rate ? (rate * 0.99).toFixed(4) : "...";
          return <li key={to}>{from} → {to}: {adjusted}</li>;
        })}
      </ul>
    </main>
  );
}
