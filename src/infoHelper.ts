import {TOKEN_2022_PROGRAM_ID, getMint} from '@solana/spl-token'
import {Connection, PublicKey} from '@solana/web3.js'

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

	console.log('\n------------------------------\n')
	console.log('\tMint Info')
	console.log('\n------------------------------\n')

	console.log(
		`Public key: ${mintInfo.address.toBase58()} \ndecimals: ${mintInfo.decimals} \nfreezeAuthority: ${mintInfo.freezeAuthority} \nisInitialized: ${mintInfo.isInitialized} \nmintAuthority: ${mintInfo.mintAuthority} \nsupply: ${mintInfo.supply} \ntlvData: ${mintInfo.tlvData}`
	)

	console.log('\n------------------------------')
}
