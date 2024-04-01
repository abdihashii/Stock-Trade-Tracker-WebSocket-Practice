import { useEffect, useState } from 'react';

export type TTradeData = {
	s: string; // Symbol
	p: number; // Price
	t: number; // UNIX milliseconds timestamp
	v: number; // Volume
	c: number[]; // List of trade conditions
};

function App() {
	const [trades, setTrades] = useState<TTradeData[]>([]);

	useEffect(() => {
		const websocket = new WebSocket(
			`wss://ws.finnhub.io?token=${import.meta.env.VITE_FINNHUB_API_KEY}`,
		);

		websocket.onopen = () => {
			websocket.send(JSON.stringify({ type: 'subscribe', symbol: 'AAPL' }));
		};

		websocket.onmessage = async (event) => {
			const response = JSON.parse(await event.data);

			const { data, type } = response;

			debugger;

			if (type === 'trade') {
				setTrades((prevTrades) => [...prevTrades, ...data]);
			}
		};
	}, []);

	return (
		<main className="flex min-h-screen flex-col items-center gap-10 p-20">
			<h1 className="text-6xl">AAPL Trades</h1>

			<section>
				{trades.length > 0 && (
					<ul className="flex w-96 flex-col gap-5 rounded-lg border border-gray-300 p-5">
						{trades.map((trade) => (
							<li key={`${trade.t}-${trade.p}-${trade.v}`}>
								<p>SYMBOL: {trade.s}</p>
								<p>PRICE: ${trade.p}</p>
								<p>VOLUME: {trade.v}</p>
							</li>
						))}
					</ul>
				)}
			</section>
		</main>
	);
}

export default App;
