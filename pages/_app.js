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
		</WagmiConfig>
	);
}

export default MyApp;
