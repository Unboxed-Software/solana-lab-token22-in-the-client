import {
	ASSOCIATED_TOKEN_PROGRAM_ID,
	AccountLayout,
	TOKEN_2022_PROGRAM_ID,
	createMint,
	getOrCreateAssociatedTokenAccount,
	mintTo,
} from '@solana/spl-token'
import {Cluster, Connection, Keypair, PublicKey} from '@solana/web3.js'
import {getMintInfo} from './infoHelper'

const createAndFetchToken22 = async (
	cluster: Cluster,
	connection: Connection,
	keyPair: Keypair
) => {
	const mint = await createMint(
		connection,
		keyPair,
		keyPair.publicKey,
		keyPair.publicKey,
		9,
		undefined,
		{
			commitment: 'finalized',
		},
		TOKEN_2022_PROGRAM_ID
	)
	console.log(
		`You can view your token in the solana explorer at https://explorer.solana.com/address/${mint.toBase58()}?cluster=${cluster}`
	)

	await getMintInfo(connection, mint, true)

	const tokenAccount = await getOrCreateAssociatedTokenAccount(
		connection,
		keyPair,
		mint,
		keyPair.publicKey,
		true,
		'finalized',
		{commitment: 'finalized'},
		TOKEN_2022_PROGRAM_ID
	)

	console.log(`Associated token account: ${tokenAccount.address.toBase58()}`)

	await mintTo(
		connection,
		keyPair,
		mint,
		tokenAccount.address,
		keyPair,
		100000000000,
		undefined,
		{commitment: 'finalized'},
		TOKEN_2022_PROGRAM_ID
	)

	await getMintInfo(connection, mint, true)

	const tokenAccountsByOwner = await connection.getTokenAccountsByOwner(
		keyPair.publicKey,
		{programId: TOKEN_2022_PROGRAM_ID}
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

export default createAndFetchToken22
