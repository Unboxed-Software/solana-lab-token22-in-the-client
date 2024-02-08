import {
	createMint,
	getMint,
	getOrCreateAssociatedTokenAccount,
	mintTo,
} from '@solana/spl-token'
import {Cluster, Connection, Keypair, PublicKey} from '@solana/web3.js'
import printTableData from './print-helpers'

/**
 * Create a new mint and mint some tokens to the associated token account
 * THE ONLY CHANGE IS THE PROGRAM ID
 * @param cluster The cluster to connect to
 * @param connection The connection to use
 * @param tokenProgramId The program id to use for the token
 * @param payer The keypair to use for paying for the transactions
 * @param decimals The number of decimals to use for the mint
 * @param mintAmount The amount of tokens to mint
 * @returns The mint public key
 */
async function createAndMintToken(
	cluster: Cluster,
	connection: Connection,
	tokenProgramId: PublicKey,
	payer: Keypair,
	decimals: number,
	mintAmount: number,
): Promise<PublicKey> {

	console.log('\nCreating a new mint...')
	const mint = await createMint(
		connection,
		payer,
		payer.publicKey,
		payer.publicKey,
		decimals,
		undefined,
		{
			commitment: 'finalized',
		},
		tokenProgramId
	)
	console.log(
		`You can view your token in the solana explorer at https://explorer.solana.com/address/${mint.toBase58()}?cluster=${cluster}`
	)

	console.log('\nFetching mint info...')
	const mintInfo = await getMintInfo(connection, mint, tokenProgramId)
	printTableData(mintInfo);

	console.log('\nCreating associated token account...')
	const tokenAccount = await getOrCreateAssociatedTokenAccount(
		connection,
		payer,
		mint,
		payer.publicKey,
		true,
		'finalized',
		{commitment: 'finalized'},
		tokenProgramId
	)

	console.log(`Associated token account: ${tokenAccount.address.toBase58()}`)

	console.log('\nMinting to associated token account...')
	await mintTo(
		connection,
		payer,
		mint,
		tokenAccount.address,
		payer,
		mintAmount,
		[payer],
		{commitment: 'finalized'},
		tokenProgramId
	)

	return mint
}

export async function getMintInfo(
	connection: Connection,
	mint: PublicKey,
	tokenProgramId: PublicKey,
){
	const mintInfo = await getMint(
		connection,
		mint,
		'finalized',
		tokenProgramId
	)

	return mintInfo;
}

export default createAndMintToken
