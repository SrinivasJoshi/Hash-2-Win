import '../styles/globals.css';
import '@rainbow-me/rainbowkit/styles.css';
import {
	getDefaultWallets,
	RainbowKitProvider,
	lightTheme,
} from '@rainbow-me/rainbowkit';
import { configureChains, createClient, WagmiConfig } from 'wagmi';
import { publicProvider } from '@wagmi/core/providers/public';
import { polygonMumbai } from '@wagmi/core/chains';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const { chains, provider } = configureChains(
	[polygonMumbai],
	[publicProvider()]
);

const { connectors } = getDefaultWallets({
	appName: 'Commit-Reveal App',
	chains,
});

const wagmiClient = createClient({
	autoConnect: true,
	connectors,
	provider,
});

function MyApp({ Component, pageProps }) {
	return (
		<WagmiConfig client={wagmiClient}>
			<RainbowKitProvider
				chains={chains}
				coolMode
				theme={lightTheme({
					accentColor: '#FFA07A',
					accentColorForeground: '#2F2E41',
					borderRadius: 'large',
					fontStack: 'system',
				})}>
				<Component {...pageProps} />
			</RainbowKitProvider>
			<ToastContainer
				position='top-right'
				autoClose={5000}
				hideProgressBar={false}
				newestOnTop={false}
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
				theme='dark'
			/>
		</WagmiConfig>
	);
}

export default MyApp;
