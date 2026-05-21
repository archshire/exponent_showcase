module.exports = {
	root: true,
	parser: '@typescript-eslint/parser',
	plugins: ['@typescript-eslint'],
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'prettier' // last - disables rules that conflict with prettier
	],
	env: {
		node: true,
		es2022: true,
	},
	rules: {
		'@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
		'@typescript-eslint/explicit-function-return-type': 'off',
	},
	ignorePatterns: ['dist/', 'node_modules/', '.next/'],
}

