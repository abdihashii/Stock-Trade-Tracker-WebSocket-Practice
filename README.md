### How to run:

1. Add your Finnhub.io API key to client/.env
2. Navigate to client direcory: `cd client`
3. `pnpm install`
4. `pnpm run dev`

### Summary

I explored how to handle real-time data using the [Finnhub WebSocket API](https://finnhub.io/docs/api). When starting the web app, we open a WebSocket connection to Finnhub and subscribe to the AAPL ticker and get a constant stream of trade data. We're talking about hundereds of trade data coming in to our app per second.

In this project, I'm learning how to create a performant and optimized web app that can handle this large number of requests and providing great functionality.

Using [react-window](https://npmjs.com/package/react-window), we're able to limit the amount of trades that are included in the DOM by a specific limit instead of displaying hundreds of trades in the DOM.

### Features

- "Infinite" vertical scroll
- Toggle WebSocket connection in the UI
- Toggle autoscroll

### Stack

- React with Vite and TypeScript
- react-window
- Tailwindcss
- eslint + prettier
