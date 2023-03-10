import Link from 'next/link';
import React from 'react';

const Button = ({ text, link }) => {
	return (
		<Link href={link}>
			<div className='cursor-pointer bg-orange font-bold text-purple px-3 py-2 rounded-3xl'>
				{text}
			</div>
		</Link>
	);
};

export default Button;
