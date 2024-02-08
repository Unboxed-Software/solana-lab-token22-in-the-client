import {Cluster, Connection, clusterApiUrl} from '@solana/web3.js'
import {initializeKeypair} from './keypair-helpers'
import createAndMintToken, { getMintInfo } from './create-and-mint-token'
import printTableData from './print-helpers'
import { TOKEN_2022_PROGRAM_ID, TOKEN_PROGRAM_ID } from '@solana/spl-token'
import { TokenInfoForDisplay, fetchTokenInfo, fetchTokenProgramFromAccount } from './fetch-token-info'
import burnAllTokensInAccount from './burn-tokens'

const CLUSTER: Cluster = 'devnet'

async function main() {

	/**
	 * Create a connection and initialize a keypair if one doesn't already exists.
	 * If a keypair exists, airdrop a sol if needed.
	 */
	// const connection = new Connection(clusterApiUrl(CLUSTER))
	const connection = new Connection('http://127.0.0.1:8899')
	const keyPair = await initializeKeypair(connection)

	console.log(`public key: ${keyPair.publicKey.toBase58()}`)

	const decimals = 9; 
	const mintAmount = 100 * 10 ** decimals;

	/**
	 * Using TOKEN_PROGRAM_ID, create a mint, create a associated token account and mint 100 tokens to that token account
	 */
	const regularMint = await createAndMintToken(CLUSTER, connection, TOKEN_PROGRAM_ID, keyPair, decimals, mintAmount);

	/**
	 * Using TOKEN_2022_PROGRAM_ID, create a mint, create a associated token account and mint 100 tokens to that token account
	 */
	const token22Mint = await createAndMintToken(CLUSTER, connection, TOKEN_2022_PROGRAM_ID, keyPair, decimals, mintAmount);

	/**
	 * Using TOKEN_2022_PROGRAM_ID, create a mint, create a associated token account and mint 100 tokens to that token account
	 */
	const regularMintTokenProgram = await fetchTokenProgramFromAccount(connection, regularMint);
	const token22MintTokenProgram = await fetchTokenProgramFromAccount(connection, token22Mint);

	if(! regularMintTokenProgram.equals(TOKEN_PROGRAM_ID)) throw new Error('Regular mint token program is not correct');
	if(! token22MintTokenProgram.equals(TOKEN_2022_PROGRAM_ID)) throw new Error('Token22 mint token program is not correct');

	/**
	 * Fetch and display tokens owned which are created using both TOKEN_PROGRAM_ID and TOKEN_2022_PROGRAM_ID
	 */
	const myTokens: TokenInfoForDisplay[] = []

	myTokens.push(
		...await fetchTokenInfo(connection, keyPair, TOKEN_PROGRAM_ID, 'Token'),
		...await fetchTokenInfo(connection, keyPair, TOKEN_2022_PROGRAM_ID, 'Token22'),
	)

	printTableData(myTokens)

	
	/**
	 * Burn all of our newly minted tokens from both mints and show the supply of both mints
	 */
	await burnAllTokensInAccount(connection, TOKEN_PROGRAM_ID, keyPair, regularMint);
	await burnAllTokensInAccount(connection, TOKEN_2022_PROGRAM_ID, keyPair, token22Mint);

	const mintsToShow = [];
	mintsToShow.push(
		await getMintInfo(connection, regularMint, TOKEN_PROGRAM_ID),
		await getMintInfo(connection, token22Mint, TOKEN_2022_PROGRAM_ID),
	)

	printTableData(mintsToShow);
	
}

main()
