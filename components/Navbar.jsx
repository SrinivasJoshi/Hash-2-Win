import React from 'react';
import { useAccount, useConnect } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';

const Navbar = () => {
	const { address, isConnected } = useAccount();
	const { connect } = useConnect({
		connector: new InjectedConnector(),
	});
	if (isConnected)
		return (
			<nav className='w-full flex flex-row-reverse p-3'>
				<button className=' bg-orange font-bold text-purple px-3 py-2 rounded-3xl self-center'>
					{address.slice(0, 4) + '..' + address.slice(-4)}
				</button>
			</nav>
		);
	return (
		<nav className='w-full flex flex-row-reverse p-3'>
			<button
				className='cursor-pointer bg-orange font-bold text-purple px-3 py-2 rounded-3xl self-center'
				onClick={() => connect()}>
				Connect Wallet
			</button>
		</nav>
	);
};

export default Navbar;
