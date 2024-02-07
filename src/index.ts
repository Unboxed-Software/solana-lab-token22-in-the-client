import {Cluster, Connection, clusterApiUrl} from '@solana/web3.js'
import {initializeKeypair} from './initializeKeypair'
import createAndMintToken22 from './token22'
import createAndMintToken from './token'
import {getOwnedTokens} from './infoHelper'

const CLUSTER: Cluster = 'devnet'

async function main() {
	/**
	 * Create a connection and initialize a keypair if one doesn't already exists.
	 * If a keypair exists, airdrop a sol if needed.
	 */
	const connection = new Connection(clusterApiUrl(CLUSTER))
	const keyPair = await initializeKeypair(connection)

	console.log(`public key: ${keyPair.publicKey.toBase58()}`)

	/**
	 * Using TOKEN_PROGRAM_ID, create a mint, create a associated token account and mint 100 tokens to that token account
	 */
	await createAndMintToken(CLUSTER, connection, keyPair)

	/**
	 * Using TOKEN_2022_PROGRAM_ID, create a mint, create a associated token account and mint 100 tokens to that token account
	 */
	await createAndMintToken22(CLUSTER, connection, keyPair)

	/**
	 * Fetch and display tokens owned which are created using both TOKEN_PROGRAM_ID and TOKEN_2022_PROGRAM_ID
	 */
	await getOwnedTokens(connection, keyPair)
}

main()
