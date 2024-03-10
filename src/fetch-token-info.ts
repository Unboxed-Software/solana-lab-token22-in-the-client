import { AccountLayout, getMint } from "@solana/spl-token"
import { Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js"

export type TokenTypeForDisplay = 'Token Program' | 'Token Extension Program';

export interface TokenInfoForDisplay {
  mint: PublicKey
  amount: number
  decimals: number
  displayAmount: number
  type: TokenTypeForDisplay
}

export async function fetchTokenInfo(
  connection: Connection,
  owner: PublicKey,
  programId: PublicKey,
  type: TokenTypeForDisplay
): Promise<TokenInfoForDisplay[]> {
	const tokenAccounts = await connection.getTokenAccountsByOwner(
		owner,
		{programId}
	)

    const ownedTokens: TokenInfoForDisplay[] = []

    for (const tokenAccount of tokenAccounts.value) {
        const accountData = AccountLayout.decode(tokenAccount.account.data)

        const mintInfo = await getMint(connection, accountData.mint, 'finalized', programId)

        ownedTokens.push({
			mint: accountData.mint,
            amount: Number(accountData.amount),
            decimals: mintInfo.decimals,
			displayAmount: Number(accountData.amount) / (10**mintInfo.decimals),
			type,
		})
    }

  return ownedTokens;
}

export async function fetchTokenProgramFromAccount(
    connection: Connection,
    mint: PublicKey
  ){
    //Find the program ID from the mint
    const accountInfo = await connection.getParsedAccountInfo(mint);
    if (accountInfo.value === null) {
        throw new Error('Account not found');
    }
    const programId = accountInfo.value.owner;
    return programId;
  }