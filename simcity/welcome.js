
const HOracle = artifacts.require("HOracle.sol");
const HodlDex = artifacts.require("HodlDex");
const HTokenReserve = artifacts.require("HTokenReserve");
const HodlDexProxyAdmin = artifacts.require("HodlDexProxyAdmin");
const HTokenReserveProxyAdmin = artifacts.require("HTokenReserveProxyAdmin");
const HodlDexProxy = artifacts.require("HodlDexProxy");
const HTokenReserveProxy = artifacts.require("HTokenReserveProxy");
const Proportional = artifacts.require("Proportional");
const ProportionalTest = artifacts.require("ProportionalTest");
const { provider, residents } = require('./neighborhood')
const fs = require('fs');

module.exports = async (config) => {
  console.log("1 - set providers for contracts")
  HOracle.setProvider(provider);
  HodlDex.setProvider(provider);
  HTokenReserve.setProvider(provider);
  HodlDexProxyAdmin.setProvider(provider);
  HTokenReserveProxyAdmin.setProvider(provider);
  Proportional.setProvider(provider);
  console.log("1 - finished setting providers\n")
  console.log("2 - starting prep for revoking migration-role")
  try {
    const tokenReserveProxy = await HTokenReserveProxy.deployed();
    const hodlDexProxy = await HodlDexProxy.deployed();
    const upgradableTokenReserve = await HTokenReserve.at(tokenReserveProxy.address);
    const upgradableHodlDex = await HodlDex.at(hodlDexProxy.address)
    const hodlDex = await HodlDex.at(hodlDexProxy.address)
    const tokenAddress = await upgradableTokenReserve.erc20Token();
    const MIGRATION_ROLE = await hodlDex.MIGRATION_ROLE()
    const ADMIN = residents['mayor'].address
    console.log("2 - finished prep for revoking migration-role\n")
    console.log("3 - set some hodl and eth amounts")
    const initHodlcAmount = await web3.utils.toWei('50000', 'ether')
    const initEthAmount = await web3.utils.toWei('10000', 'ether')
    const initEthAmountToDeposit = await web3.utils.toWei('1000', 'ether')
    const initEthPrice = await web3.utils.toWei('511.99', 'ether')
    const fromAdmin = { from: ADMIN }
    console.log("3 - finished setting some hodl and eth amounts\n")

    console.log("4 - Set ETH USD price in oracle")
    await hodlDex.oracleSetEthUsd(initEthPrice, fromAdmin)
    console.log("4 - finished setting ETH USD price in oracle\n")

    console.log("5 - start revoke MITRATION_ROLE")
    await hodlDex.revokeRole(MIGRATION_ROLE, ADMIN, fromAdmin)
    console.log("5 - finished revoking MITRATION_ROLE\n")

    console.log("6 - check for run status")
    const running = await hodlDex.isRunning({ from:ADMIN })
    console.log("6 - running confirmed: ", running)

    console.log("\n7 - Start depositing Eth into hodldex user accounts\n")
    await hodlDex.depositEth({ from: residents["andy"].address, value: initEthAmountToDeposit })
    await hodlDex.depositEth({ from: residents["shelly"].address, value: initEthAmountToDeposit })
    await hodlDex.depositEth({ from: residents["doggy"].address, value: initEthAmountToDeposit })
    console.log("7 - Finished depositing Eth into hodldex user accounts\n")
    console.log("\n8 - Start confirm user balances\n")
    const reserveBal1 = await hodlDex.user(residents["andy"].address)
    console.log("Andy user eth balance: " + reserveBal1.balanceEth + "\nAndy user HodlC balance: " + reserveBal1.balanceHodl + "\nAndy user HodlC controlled: " + reserveBal1.controlledHodl)
    const reserveBal2 = await hodlDex.user(residents["shelly"].address)
    console.log("\nshelly user eth balance: " + reserveBal2.balanceEth + "\nshelly user HodlC balance: " + reserveBal2.balanceHodl + "\nshelly user HodlC controlled: " + reserveBal2.controlledHodl)
    const reserveBal3 = await hodlDex.user(residents["doggy"].address)
    console.log("\ndoggy user eth balance: " + reserveBal3.balanceEth + "\ndoggy user HodlC balance: " + reserveBal3.balanceHodl + "\ndoggy user HodlC controlled: " + reserveBal3.controlledHodl)
    console.log("\n8 - Finish confirm user balances\n")

    console.log("9 - Start buying tokens from reserve, 3 users")
    await hodlDex.buyHodlC(web3.utils.toWei('10', 'ether'), 400000, {from:residents["andy"].address})
    await hodlDex.buyHodlC(web3.utils.toWei('10', 'ether'), 400000, {from:residents["andy"].address})
    await hodlDex.buyHodlC(web3.utils.toWei('10', 'ether'), 400000, {from:residents["andy"].address})
    await hodlDex.buyHodlC(web3.utils.toWei('10', 'ether'), 400000, {from:residents["andy"].address})
    await hodlDex.buyHodlC(web3.utils.toWei('10', 'ether'), 400000, {from:residents["shelly"].address})
    await hodlDex.buyHodlC(web3.utils.toWei('10', 'ether'), 400000, {from:residents["shelly"].address})
    await hodlDex.buyHodlC(web3.utils.toWei('10', 'ether'), 400000, {from:residents["shelly"].address})
    await hodlDex.buyHodlC(web3.utils.toWei('10', 'ether'), 400000, {from:residents["doggy"].address})
    await hodlDex.buyHodlC(web3.utils.toWei('10', 'ether'), 400000, {from:residents["doggy"].address})
    console.log("\n9 - finished buying tokens from reserve, 3 users")
    console.log("\n10 - Start Confirm user balances\n")
    const reserveBal4 = await hodlDex.user(residents["andy"].address)
    console.log("Andy user eth balance: " + reserveBal4.balanceEth + "\nAndy user HodlC balance: " + reserveBal4.balanceHodl + "\nAndy user HodlC controlled: " + reserveBal4.controlledHodl)
    const reserveBal5 = await hodlDex.user(residents["shelly"].address)
    console.log("\nshelly user eth balance: " + reserveBal5.balanceEth + "\nshelly user HodlC balance: " + reserveBal5.balanceHodl + "\nshelly user HodlC controlled: " + reserveBal5.controlledHodl)
    const reserveBal6 = await hodlDex.user(residents["doggy"].address)
    console.log("\ndoggy user eth balance: " + reserveBal6.balanceEth + "\ndoggy user HodlC balance: " + reserveBal6.balanceHodl + "\ndoggy user HodlC controlled: " + reserveBal6.controlledHodl)
    console.log("\n10 - Finish Confirm user balances\n")
    console.log("\n11 - set private config")
    const privateConfig = {
      rpcEndpoint: 'http://127.0.0.1:8545',
      dexContractAddress: upgradableHodlDex.address, // HodlDex Proxy
      tokenContractAddress: tokenAddress, // HTEthUsd
      tokenReserveContractAddress: upgradableTokenReserve.address, // HTokenReserve Proxy
    }
    console.log("\n12 - try catch setting private config file")
    const d = JSON.stringify(privateConfig, null, 2);
    console.log('CONFIG', d)
    fs.writeFileSync('../HETHUSD-ui/src/private-network.json', d);
  } catch (e) {
    console.error(e);
  }

  process.exit(0);
}
