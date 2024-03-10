import { createMint, getMint, getOrCreateAssociatedTokenAccount, mintTo } from "@solana/spl-token";
import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import printTableData from "./print-helpers";

export async function createAndMintToken(
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
			commitment: 'finalized', // confirmOptions argument
		},
		tokenProgramId
	)

	console.log('\nFetching mint info...')

	const mintInfo = await getMint(
		connection,
		mint,
		'finalized',
		tokenProgramId
	)

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