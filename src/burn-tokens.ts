import { burn, getOrCreateAssociatedTokenAccount } from "@solana/spl-token";
import { Connection, Keypair, PublicKey } from "@solana/web3.js";

async function burnAllTokensInAccount(
    connection: Connection,
	tokenProgramId: PublicKey,
	payer: Keypair,
    mint: PublicKey,
): Promise<void> {

    console.log(`\nBurning all tokens in account from mint ${mint.toBase58()}...`)
    // Get ATA
	const tokenAccount = await getOrCreateAssociatedTokenAccount(
		connection,
		payer,
		mint,
		payer.publicKey,
		true,
		'finalized',
		{commitment: 'finalized'},
		tokenProgramId
	);

    // Burn tokens
    await burn(
        connection,
        payer,
        tokenAccount.address,
        mint,
        payer,
        tokenAccount.amount,
        undefined,
        {commitment: 'finalized'},
        tokenProgramId,
    )

}

export default burnAllTokensInAccount;