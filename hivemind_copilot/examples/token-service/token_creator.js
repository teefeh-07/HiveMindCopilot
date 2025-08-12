/**
 * HiveMind Copilot Example: Token Creation
 * 
 * This script demonstrates how to create a fungible token on the Hedera network
 * using the Hedera JavaScript SDK with HiveMind Copilot assistance.
 */

const {
  Client,
  PrivateKey,
  TokenCreateTransaction,
  TokenType,
  TokenSupplyType,
  TokenInfoQuery,
  AccountBalanceQuery,
  Hbar,
} = require("@hashgraph/sdk");
require('dotenv').config();

async function createToken() {
  // Check environment variables
  if (!process.env.OPERATOR_ID || !process.env.OPERATOR_KEY) {
    throw new Error("Environment variables OPERATOR_ID and OPERATOR_KEY must be present");
  }

  // Configure client
  const operatorId = process.env.OPERATOR_ID;
  const operatorKey = PrivateKey.fromString(process.env.OPERATOR_KEY);
  const client = Client.forTestnet().setOperator(operatorId, operatorKey);

  // Generate key pairs for the token
  const adminKey = PrivateKey.generateED25519();
  const supplyKey = PrivateKey.generateED25519();
  const treasuryKey = operatorKey;
  const treasuryId = operatorId;

  console.log(`- Generated admin key: ${adminKey.toString()}`);
  console.log(`- Generated supply key: ${supplyKey.toString()}`);
  console.log(`- Using treasury key: ${treasuryKey.toString()}`);

  // Create token with HiveMind recommended settings
  const transaction = new TokenCreateTransaction()
    .setTokenName("HiveMind Example Token")
    .setTokenSymbol("HMT")
    .setDecimals(2)
    .setInitialSupply(10000)
    .setTreasuryAccountId(treasuryId)
    .setAdminKey(adminKey.publicKey)
    .setSupplyKey(supplyKey.publicKey)
    .setTokenType(TokenType.FungibleCommon)
    .setSupplyType(TokenSupplyType.Infinite)
    .setMaxTransactionFee(new Hbar(30))
    .freezeWith(client);

  // Sign the transaction with the treasury key
  const signedTxn = await transaction.sign(treasuryKey);

  // Submit the transaction to the Hedera network
  const txnResponse = await signedTxn.execute(client);

  // Get the receipt of the transaction
  const receipt = await txnResponse.getReceipt(client);

  // Get the token ID from the receipt
  const tokenId = receipt.tokenId;
  console.log(`- Created token with ID: ${tokenId}`);

  // Query token info to verify creation
  const tokenInfo = await new TokenInfoQuery()
    .setTokenId(tokenId)
    .execute(client);

  console.log("Token Info:");
  console.log(`- Name: ${tokenInfo.name}`);
  console.log(`- Symbol: ${tokenInfo.symbol}`);
  console.log(`- Total Supply: ${tokenInfo.totalSupply}`);
  console.log(`- Decimals: ${tokenInfo.decimals}`);

  // Check the treasury balance
  const treasuryBalance = await new AccountBalanceQuery()
    .setAccountId(treasuryId)
    .execute(client);

  console.log(`- Treasury balance: ${treasuryBalance.tokens.get(tokenId.toString())}`);

  return tokenId;
}

// Execute the token creation function
createToken()
  .then(tokenId => {
    console.log(`Token creation completed successfully. Token ID: ${tokenId}`);
    process.exit(0);
  })
  .catch(error => {
    console.error(`Error creating token: ${error}`);
    process.exit(1);
  });
