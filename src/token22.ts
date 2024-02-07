import {
	TOKEN_2022_PROGRAM_ID,
	createMint,
	getOrCreateAssociatedTokenAccount,
	mintTo,
} from '@solana/spl-token'
import {Cluster, Connection, Keypair, PublicKey} from '@solana/web3.js'
import {getMintInfo} from './infoHelper'

const createAndMintToken22 = async (
	cluster: Cluster,
	connection: Connection,
	keyPair: Keypair
) => {
	console.log('\n---Using Token-2022 Program---\n')
	console.log('\nCreating a new mint...')
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

	console.log('\nFetching mint info...')
	await getMintInfo(connection, mint, true)

	console.log('\nCreating associated token account...')
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

	console.log('\nMinting to associated token account...')
	await mintTo(
		connection,
		keyPair,
		mint,
		tokenAccount.address,
		keyPair,
		100000000000,
		[keyPair],
		{commitment: 'finalized'},
		TOKEN_2022_PROGRAM_ID
	)

	console.log('\nGetting mint info to check supply...')
	await getMintInfo(connection, mint, true)
}

export default createAndMintToken22
