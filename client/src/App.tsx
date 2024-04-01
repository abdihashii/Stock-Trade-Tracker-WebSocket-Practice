import { VariableSizeList as List } from 'react-window';
import useTrades from './hooks/useTrades';

function App() {
	const {
		listRef,
		trades,
		toggleAutoScroll,
		toggleWebsocketConnection,
		setToggleAutoScroll,
		setToggleWebsocketConnection,
		getItemSize,
		Row,
	} = useTrades();

	return (
		<main className="flex min-h-screen flex-col items-center gap-10 p-20">
			<h1 className="text-6xl">AAPL Trades</h1>

			<section className="flex gap-4">
				<button
					className={`rounded px-4 py-2 text-white transition-colors ${toggleWebsocketConnection ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'}`}
					onClick={() =>
						setToggleWebsocketConnection(!toggleWebsocketConnection)
					}
				>
					{toggleWebsocketConnection ? 'Disconnect' : 'Re-connect'}
				</button>

				<button
					className={`rounded px-4 py-2 text-white transition-colors ${toggleAutoScroll ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'}`}
					onClick={() => setToggleAutoScroll(!toggleAutoScroll)}
				>
					{toggleAutoScroll ? 'Disable Auto-Scroll' : 'Enable Auto-Scroll'}
				</button>
			</section>

			<p># of trades: {trades.length}</p>

			<section className="border border-gray-300">
				{trades.length > 0 && (
					<List
						ref={listRef}
						height={500}
						width={600}
						itemCount={trades.length}
						itemSize={getItemSize}
					>
						{Row}
					</List>
				)}
			</section>
		</main>
	);
}

export default App;
