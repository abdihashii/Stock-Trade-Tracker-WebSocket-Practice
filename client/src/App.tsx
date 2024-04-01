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
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 10;

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
				setTrades((prevTrades) => {
					const newTrades = [...prevTrades, ...data];

					// calculate the new total number of pages
					const newTotalPages = Math.ceil(newTrades.length / itemsPerPage);

					// set the current page to the newest page with data
					setCurrentPage(newTotalPages);

					return newTrades;
				});
			}
		};
	}, []);

	const lastPageIndex = currentPage * itemsPerPage;
	const firstPageIndex = lastPageIndex - itemsPerPage;
	const currentTrades = trades.slice(firstPageIndex, lastPageIndex);

	const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

	return (
		<main className="flex min-h-screen flex-col items-center gap-10 p-20">
			<h1 className="text-6xl">AAPL Trades</h1>

			<section>
				{currentTrades.length > 0 && (
					<ul className="flex w-96 flex-col gap-5 rounded-lg border border-gray-300 p-5">
						{currentTrades.map((trade) => {
							const date = new Date(trade.t);

							const hours = date.getHours();
							const minutes = date.getMinutes();
							const seconds = date.getSeconds();

							const timeString = `${hours}:${minutes}:${seconds}`;

							return (
								<li key={`${trade.t}-${trade.p}-${trade.v}`}>
									<p>TIME: {timeString}</p>
									<p>SYMBOL: {trade.s}</p>
									<p>PRICE: ${trade.p}</p>
									<p>VOLUME: {trade.v}</p>
								</li>
							);
						})}
					</ul>
				)}

				<div>
					{Array.from(
						{ length: Math.ceil(trades.length / itemsPerPage) },
						(_, i) => i + 1,
					).map((number) => (
						<button
							className={`border px-3 py-1 ${currentPage === number ? 'bg-gray-300' : ''}`}
							key={number}
							onClick={() => paginate(number)}
						>
							{number}
						</button>
					))}
				</div>
			</section>
		</main>
	);
}

export default App;
