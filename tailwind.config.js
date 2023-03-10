/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		'./app/**/*.{js,ts,jsx,tsx}',
		'./pages/**/*.{js,ts,jsx,tsx}',
		'./components/**/*.{js,ts,jsx,tsx}',

		// Or if using `src` directory:
		'./src/**/*.{js,ts,jsx,tsx}',
	],
	theme: {
		extend: {
			colors: {
				// prettier-ignore
				'purple': '#2F2E41',
				// prettier-ignore
				'orange': '#FFA07A',
			},
			fontFamily: {
				//prettier-ignore
				'montserrat': ['Montserrat', 'sans-serif'],
				//prettier-ignore
				'openSans': ['Open Sans', 'sans-serif'],
			},
		},
	},
	plugins: [],
};
