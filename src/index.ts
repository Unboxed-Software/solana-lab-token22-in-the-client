import {Cluster, Connection, PublicKey, clusterApiUrl} from '@solana/web3.js'
import {initializeKeypair} from './initializeKeypair'
import createAndFetchToken22 from './token22'

const CLUSTER: Cluster = 'devnet'

async function main() {
	const connection = new Connection(clusterApiUrl(CLUSTER))
	const keyPair = await initializeKeypair(connection)

	console.log(`public key: ${keyPair.publicKey.toBase58()}`)

	//createAndFetchToken(CLUSTER, connection, keyPair)
	createAndFetchToken22(CLUSTER, connection, keyPair)
}

main()
