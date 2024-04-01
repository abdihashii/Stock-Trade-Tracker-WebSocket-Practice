import { useEffect, useRef, useState } from 'react';
import {
	VariableSizeList as List,
	ListChildComponentProps,
} from 'react-window';

const BUFFER_SIZE = 10; // Number of trades to keep in memory
let tradeIdCounter = 0; // Counter to generate unique trade IDs

export type TTradeData = {
	id: string; // Unique identifier for the trade
	s: string; // Symbol
	p: number; // Price
	t: number; // UNIX milliseconds timestamp
	v: number; // Volume
	c: number[]; // List of trade conditions
};

const useTrades = () => {
	const listRef = useRef<List>(null);
	const [trades, setTrades] = useState<TTradeData[]>([]);
	const [buffer, setBuffer] = useState<TTradeData[]>([]); // Our data structure to store trades
	const [toggleAutoScroll, setToggleAutoScroll] = useState(false);
	const [toggleWebsocketConnection, setToggleWebsocketConnection] =
		useState(true);

	useEffect(() => {
		let websocket: WebSocket | null = null;

		if (toggleWebsocketConnection) {
			websocket = new WebSocket(
				`wss://ws.finnhub.io?token=${import.meta.env.VITE_FINNHUB_API_KEY}`,
			);

			websocket.onopen = () => {
				websocket?.send(JSON.stringify({ type: 'subscribe', symbol: 'AAPL' }));
			};

			websocket.onmessage = async (event) => {
				const response = JSON.parse(await event.data);
				const { data, type } = response;

				if (type === 'trade') {
					// add a unique identifier to each trade
					const tradesWithId = data.map((trade: TTradeData) => ({
						...trade,
						id: `${trade.s}-${trade.t}-${tradeIdCounter++}`, // ensuring uniqueness
					}));

					// buffer incoming trades
					setBuffer((prevBuffer) =>
						[...prevBuffer, ...tradesWithId].slice(-BUFFER_SIZE),
					);
				}
			};
		}

		return () => {
			if (websocket) {
				websocket.close();
				websocket = null;
			}
		};
	}, [toggleWebsocketConnection]);

	useEffect(() => {
		if (buffer.length === 0) return;

		// Process the buffered trades every second
		const intervalId = setInterval(() => {
			// prepend the new trades to the existing trades
			setTrades((prevTrades) => {
				const newTrades = [...buffer, ...prevTrades];

				return newTrades;
			});

			// scroll to the top only if auto-scroll is enabled
			if (toggleAutoScroll && listRef.current) {
				listRef.current.scrollTo(0);
			}

			// clear the buffer after processing it
			setBuffer([]);
		}, 1000);

		return () => {
			clearInterval(intervalId);
		};
	}, [buffer, toggleAutoScroll]);

	const rowHeights = new Array(trades.length).fill(true).map(() => {
		// automatically calculate the height of each row based on the content
		return 150;
	});

	const getItemSize = (index: number) => rowHeights[index];

	const Row = ({ index, style }: ListChildComponentProps) => {
		const trade = trades[index];
		const date = new Date(trade.t);

		const hours = date.getHours();
		const minutes = date.getMinutes().toString().padStart(2, '0');
		const seconds = date.getSeconds().toString().padStart(2, '0');

		const timeString = `${hours}:${minutes}:${seconds}`;

		return (
			<div
				style={{
					...style,
					backgroundColor: index % 2 === 0 ? '#e3e3e3' : '#fff',
					padding: '1rem',
					border: '1px solid #e0e0e0',
					overflow: 'hidden',
				}}
			>
				<p>TIME: {timeString}</p>
				<p>SYMBOL: {trade.s}</p>
				<p>PRICE: ${trade.p}</p>
				<p>VOLUME: {trade.v}</p>
			</div>
		);
	};

	return {
		trades,
		listRef,
		toggleAutoScroll,
		toggleWebsocketConnection,
		setToggleAutoScroll,
		setToggleWebsocketConnection,
		getItemSize,
		Row,
	};
};

export default useTrades;
