import {
	AccountLayout,
	TOKEN_2022_PROGRAM_ID,
	TOKEN_PROGRAM_ID,
	getMint,
} from '@solana/spl-token'
import {Connection, Keypair, LAMPORTS_PER_SOL, PublicKey} from '@solana/web3.js'

const createTableData = (obj: Object) => {
	let tableData: any = []

	if (obj instanceof Array) {
		Object.keys(obj).map((key) => {
			let currentValue = (obj as any)[key]

			if (currentValue instanceof Object) {
				Object.keys(currentValue).map((key) => {
					let nestedValue = (currentValue as any)[key]
					if (nestedValue instanceof PublicKey) {
						nestedValue = (nestedValue as PublicKey).toBase58()
						;(currentValue as any)[key] = nestedValue
					}
				})
				tableData.push(currentValue)
			}
		})
	} else {
		Object.keys(obj).map((key) => {
			let currentValue = (obj as any)[key]
			if (currentValue instanceof PublicKey) {
				currentValue = (currentValue as PublicKey).toBase58()
				;(obj as any)[key] = currentValue
			}
		})
		tableData.push(obj)
	}

	return tableData
}

export const getMintInfo = async (
	connection: Connection,
	mint: PublicKey,
	isToken22: boolean
) => {
	const mintInfo = await getMint(
		connection,
		mint,
		'finalized',
		isToken22 ? TOKEN_2022_PROGRAM_ID : undefined
	)

	console.table(createTableData(mintInfo))
	console.log()
}

export const getOwnedTokens = async (
	connection: Connection,
	keyPair: Keypair
) => {
	const tokenAccounts = await connection.getTokenAccountsByOwner(
		keyPair.publicKey,
		{programId: TOKEN_PROGRAM_ID}
	)

	let ownedTokens: any = []

	tokenAccounts.value.forEach((tokenAccount) => {
		const accountData = AccountLayout.decode(tokenAccount.account.data)
		ownedTokens.push({
			mint: accountData.mint,
			amount: Number(accountData.amount / BigInt(LAMPORTS_PER_SOL)),
			type: 'Token',
		})
	})

	const token22Accounts = await connection.getTokenAccountsByOwner(
		keyPair.publicKey,
		{programId: TOKEN_2022_PROGRAM_ID}
	)

	token22Accounts.value.forEach((tokenAccount) => {
		const accountData = AccountLayout.decode(tokenAccount.account.data)
		ownedTokens.push({
			mint: accountData.mint,
			amount: Number(accountData.amount / BigInt(LAMPORTS_PER_SOL)),
			type: 'Token22',
		})
	})
	console.table(createTableData(ownedTokens))
	console.log()
}
