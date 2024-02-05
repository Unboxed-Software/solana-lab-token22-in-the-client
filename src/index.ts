import {Cluster, Connection, PublicKey, clusterApiUrl} from '@solana/web3.js'
import {initializeKeypair} from './initializeKeypair'
import {
	AccountLayout,
	TOKEN_PROGRAM_ID,
	createMint,
	getMint,
	getOrCreateAssociatedTokenAccount,
	mintTo,
} from '@solana/spl-token'
import {getMintInfo} from './infoHelper'

const CLUSTER: Cluster = 'devnet'

async function main() {
	const connection = new Connection(clusterApiUrl(CLUSTER))
	const keyPair = await initializeKeypair(connection)

	console.log(`public key: ${keyPair.publicKey.toBase58()}`)

	const mint = await createMint(
		connection,
		keyPair,
		keyPair.publicKey,
		keyPair.publicKey,
		9,
		undefined,
		{
			commitment: 'finalized',
		}
	)

	console.log(
		`You can view your token in the solana explorer at https://explorer.solana.com/address/${mint.toBase58()}?cluster=${CLUSTER}`
	)

	//const mint = new PublicKey('9zMizcsBwCgBP5QAySa7qpqSuJrajLFZWzJDDQ5jGGJM')

	await getMintInfo(connection, mint)

	const tokenAccount = await getOrCreateAssociatedTokenAccount(
		connection,
		keyPair,
		mint,
		keyPair.publicKey,
		true,
		'finalized'
	)

	console.log(`Associated token account: ${tokenAccount.address.toBase58()}`)

	await mintTo(
		connection,
		keyPair,
		mint,
		tokenAccount.address,
		keyPair,
		100000000000
	)

	await getMintInfo(connection, mint)

	const tokenAccountsByOwner = await connection.getTokenAccountsByOwner(
		keyPair.publicKey,
		{programId: TOKEN_PROGRAM_ID}
	)

	console.log('\nToken                                         Balance')
	console.log('------------------------------------------------------------')
	tokenAccountsByOwner.value.forEach((tokenAccount) => {
		const accountData = AccountLayout.decode(tokenAccount.account.data)
		console.log(
			`${new PublicKey(accountData.mint)}   ${accountData.amount}`
		)
	})

	console.log()
}

main()
