import React from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Link from 'next/link';

const Navbar = () => {
	return (
		<nav className='w-full flex justify-between p-3'>
			<Link href='/'>
				<h2 className='text-xl text-orange text-bold cursor-pointer'>H2W</h2>
			</Link>

			<ConnectButton showBalance={false} />
		</nav>
	);
};

export default Navbar;
