import { AccountLayout } from "@solana/spl-token"
import { Connection, Keypair, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js"


export type TokenTypeForDisplay = 'Token' | 'Token22';

export interface TokenInfoForDisplay {
    mint: PublicKey
    amount: number
    type: TokenTypeForDisplay
}

export async function fetchTokenInfo(
	connection: Connection,
	keyPair: Keypair,
    programId: PublicKey,
    type: TokenTypeForDisplay
): Promise<TokenInfoForDisplay[]> {
	const tokenAccounts = await connection.getTokenAccountsByOwner(
		keyPair.publicKey,
		{programId}
	)

    const ownedTokens: TokenInfoForDisplay[] = []

	tokenAccounts.value.forEach((tokenAccount) => {
		const accountData = AccountLayout.decode(tokenAccount.account.data)
		ownedTokens.push({
			mint: accountData.mint,
			amount: Number(accountData.amount / BigInt(LAMPORTS_PER_SOL)),
			type,
		})
	})

    return ownedTokens;
}

export async function fetchTokenProgramFromAccount(
    connection: Connection,
    accountPublicKey: PublicKey
){
    //Find the program ID from the mint
    const accountInfo = await connection.getParsedAccountInfo(accountPublicKey);
    if (accountInfo.value === null) {
        throw new Error('Account not found');
    }
    const programId = accountInfo.value.owner;
    return programId;
}
