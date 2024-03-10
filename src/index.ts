import {Cluster, Connection, clusterApiUrl} from '@solana/web3.js'
import {initializeKeypair} from './keypair-helpers'

const CLUSTER: Cluster = 'devnet'

async function main() {

	/**
	 * Create a connection and initialize a keypair if one doesn't already exists.
	 * If a keypair exists, airdrop a sol if needed.
	 */
	const connection = new Connection(clusterApiUrl(CLUSTER))
	const payer = await initializeKeypair(connection)

	console.log(`Payer: ${payer.publicKey.toBase58()}`)
	
}

main()
