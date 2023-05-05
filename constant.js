export const CONTRACT_ADDRESS = '0x04182aFf2EA246Fa8E36Fd6F59C0aE0b54A7619c';

export const ABI = [
	{
		inputs: [],
		stateMutability: 'nonpayable',
		type: 'constructor',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: 'uint256',
				name: 'puzzleId',
				type: 'uint256',
			},
			{
				indexed: false,
				internalType: 'address',
				name: 'player',
				type: 'address',
			},
		],
		name: 'GuessCommitted',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: 'uint256',
				name: 'puzzleId',
				type: 'uint256',
			},
			{
				indexed: false,
				internalType: 'address',
				name: 'winner',
				type: 'address',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'prize',
				type: 'uint256',
			},
		],
		name: 'PrizeClaimed',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: 'uint256',
				name: 'puzzleId',
				type: 'uint256',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'totalPrize',
				type: 'uint256',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: '_guessDeadline',
				type: 'uint256',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: '_revealDeadline',
				type: 'uint256',
			},
		],
		name: 'PuzzleCreated',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: 'uint256',
				name: 'puzzleId',
				type: 'uint256',
			},
			{
				indexed: false,
				internalType: 'address',
				name: 'winner',
				type: 'address',
			},
		],
		name: 'WinnerOfPuzzle',
		type: 'event',
	},
	{
		inputs: [
			{
				internalType: 'uint256',
				name: '_puzzleId',
				type: 'uint256',
			},
		],
		name: 'claimPrize',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: '_user',
				type: 'address',
			},
			{
				internalType: 'uint256',
				name: '_answer',
				type: 'uint256',
			},
		],
		name: 'createCommitment',
		outputs: [
			{
				internalType: 'bytes32',
				name: '',
				type: 'bytes32',
			},
		],
		stateMutability: 'pure',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'bytes32',
				name: '_hashedAnswer',
				type: 'bytes32',
			},
			{
				internalType: 'uint256',
				name: '_guessDeadline',
				type: 'uint256',
			},
			{
				internalType: 'uint256',
				name: '_revealDeadline',
				type: 'uint256',
			},
		],
		name: 'createPuzzle',
		outputs: [],
		stateMutability: 'payable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
			{
				internalType: 'address',
				name: '',
				type: 'address',
			},
		],
		name: 'isPrizeClaimed',
		outputs: [
			{
				internalType: 'bool',
				name: '',
				type: 'bool',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
			{
				internalType: 'address',
				name: '',
				type: 'address',
			},
		],
		name: 'isPuzzleWinner',
		outputs: [
			{
				internalType: 'bool',
				name: '',
				type: 'bool',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'owner',
		outputs: [
			{
				internalType: 'address',
				name: '',
				type: 'address',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
		],
		name: 'puzzles',
		outputs: [
			{
				internalType: 'address',
				name: 'creator',
				type: 'address',
			},
			{
				internalType: 'uint256',
				name: 'totalPrize',
				type: 'uint256',
			},
			{
				internalType: 'uint256',
				name: 'guessDeadline',
				type: 'uint256',
			},
			{
				internalType: 'uint256',
				name: 'revealDeadline',
				type: 'uint256',
			},
			{
				internalType: 'uint256',
				name: 'winnerCount',
				type: 'uint256',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'uint256',
				name: '_answer',
				type: 'uint256',
			},
			{
				internalType: 'uint256',
				name: '_puzzleId',
				type: 'uint256',
			},
		],
		name: 'revealSolution',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'bytes32',
				name: '_commitment',
				type: 'bytes32',
			},
			{
				internalType: 'uint256',
				name: '_puzzleId',
				type: 'uint256',
			},
		],
		name: 'submitCommitment',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [],
		name: 'totalPuzzles',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
];
