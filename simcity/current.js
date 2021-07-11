//const timeMachine = require('ganache-time-traveler');

const HOracle = artifacts.require("HOracle.sol");
const HodlDex = artifacts.require("HodlDex");
const HTokenReserve = artifacts.require("HTokenReserve");
const HTEthUsd = artifacts.require("HTEthUsd");
const HodlDexProxyAdmin = artifacts.require("HodlDexProxyAdmin");
const HTokenReserveProxyAdmin = artifacts.require("HTokenReserveProxyAdmin");
const HodlDexProxy = artifacts.require("HodlDexProxy");
const HTokenReserveProxy = artifacts.require("HTokenReserveProxy");
const Proportional = artifacts.require("Proportional");
const ProportionalTest = artifacts.require("ProportionalTest");
const { provider, residents, fromDoggy, fromAndy, fromShelly } = require('./neighborhood');
const advanceTimeAndBlock = require('./time-travel');
const fs = require('fs');

const ASSET_ID_HODL = "0xf0a5429dabc7f51d218d3119bc4ca776cb42abb5725ccd62a1577f01f196508e";
const ASSET_ID_ETH  = "0x4c10068c4e8f0b2905447ed0a679a3934513092c8a965b7a3d1ea67ea1cd0698";
const MONTH = 60 * 1440 * 31;
const DAY = 60 * 1440;

module.exports = async (config) => {
  console.log("1 - set providers for contracts")
  HOracle.setProvider(provider);
  HodlDex.setProvider(provider);
  HTokenReserve.setProvider(provider);
  HodlDexProxyAdmin.setProvider(provider);
  HTokenReserveProxyAdmin.setProvider(provider);
  Proportional.setProvider(provider);
  //HTEthUsd.setProvider(provider);
  console.log("1 - finished setting providers\n")

  console.log("2 - starting prep for contract addresses/access")
  const tokenReserveProxy = await HTokenReserveProxy.deployed();
  const hodlDexProxy = await HodlDexProxy.deployed();
  const upgradableTokenReserve = await HTokenReserve.at(tokenReserveProxy.address);
  const upgradableHodlDex = await HodlDex.at(hodlDexProxy.address)
  const hodlDex = await HodlDex.at(hodlDexProxy.address)
  const tokenAddress = await upgradableTokenReserve.erc20Token();
  const hTEthUsd = await HTEthUsd.at(tokenAddress);
  console.log("2 - finished prep for contract addresses/access\n")

  console.log("3 - Start issue hodlT, 3 users")
  await hodlDex.hodlTIssue(web3.utils.toWei('1000', 'ether'), fromAndy)
  await hodlDex.hodlTIssue(web3.utils.toWei('1000', 'ether'), fromAndy)
  await hodlDex.hodlTIssue(web3.utils.toWei('1000', 'ether'), fromAndy)
  await hodlDex.hodlTIssue(web3.utils.toWei('1000', 'ether'), fromAndy)
  await hodlDex.hodlTIssue(web3.utils.toWei('1001', 'ether'), fromShelly)
  await hodlDex.hodlTIssue(web3.utils.toWei('1001', 'ether'), fromShelly)
  await hodlDex.hodlTIssue(web3.utils.toWei('1001', 'ether'), fromShelly)
  await hodlDex.hodlTIssue(web3.utils.toWei('1001', 'ether'), fromShelly)
  await hodlDex.hodlTIssue(web3.utils.toWei('1002', 'ether'), fromDoggy)
  await hodlDex.hodlTIssue(web3.utils.toWei('1002', 'ether'), fromDoggy)
  await hodlDex.hodlTIssue(web3.utils.toWei('1002', 'ether'), fromDoggy)
  await hodlDex.hodlTIssue(web3.utils.toWei('1002', 'ether'), fromDoggy)
  console.log("3 - End issue hodlT, 3 users\n")
  console.log("4 - Start check balances")
  try{
    const reserveBal1 = await hodlDex.user(residents["andy"].address)
    console.log("Andy user eth balance: " + reserveBal1.balanceEth + "\nAndy user HodlC balance: " + reserveBal1.balanceHodl + "\nAndy user HodlC controlled: " + reserveBal1.controlledHodl)
    let HTbal = await hTEthUsd.balanceOf(residents["andy"].address)
    console.log("HT balance andy: " + HTbal)
    const reserveBal2 = await hodlDex.user(residents["shelly"].address)
    console.log("\nshelly user eth balance: " + reserveBal2.balanceEth + "\nshelly user HodlC balance: " + reserveBal2.balanceHodl + "\nshelly user HodlC controlled: " + reserveBal2.controlledHodl)
    HTbal = await hTEthUsd.balanceOf(residents["shelly"].address)
    console.log("HT balance shelly: " + HTbal)
    const reserveBal3 = await hodlDex.user(residents["doggy"].address)
    console.log("\ndoggy user eth balance: " + reserveBal3.balanceEth + "\ndoggy user HodlC balance: " + reserveBal3.balanceHodl + "\ndoggy user HodlC controlled: " + reserveBal3.controlledHodl)
    HTbal = await hTEthUsd.balanceOf(residents["doggy"].address)
    console.log("HT balance doggy: " + HTbal)
    const reserveBal = await hodlDex.user(tokenReserveProxy.address)
    console.log("\n\nreserve contract Eth balance: " + reserveBal.balanceEth + "\nreserve contract HodlC balance: " + reserveBal.balanceHodl + "\nreserve HodlC controlled: " + reserveBal.controlledHodl)
  } catch (err) {
    console.log(err)
  }
  console.log("4 - End check balances\n")

  console.log("\n5 - Start buying hodlc loop")
  for(let i = 0; i < 50; i++){
    console.log('buy hodlc', i)
    await hodlDex.buyHodlC(web3.utils.toWei('0.2', 'ether'), 400000, {from:residents["andy"].address})
    await hodlDex.buyHodlC(web3.utils.toWei('0.2', 'ether'), 400000, {from:residents["shelly"].address})
    await hodlDex.buyHodlC(web3.utils.toWei('0.2', 'ether'), 400000, {from:residents["doggy"].address})
  }
  await advanceTimeAndBlock(DAY, web3)
  await hodlDex.hodlTIssue(web3.utils.toWei('1002', 'ether'), fromDoggy)
  console.log("5 - End buying hodlc loop\n")

  console.log("\n6 - Get distribution info ASSET_HODL\n")
  const distCount1 = await hodlDex.distributionCount(ASSET_ID_HODL)
  console.log("\nDistribution Count Before advanceTimeAndBlock: " + distCount1)
  console.log("6 - End distribution info ASSET_HODL\n")

  console.log("\n7 - Get block and time info\n")
  const blockB = await web3.eth.getBlockNumber();
  const dateB = await web3.eth.getBlock(blockB);
  console.log("Block number before time and block advance: " + blockB)
  console.log(dateB.timestamp)
  console.log("7 - End block and time info\n")

  console.log("\n8 - Advance block and time")
  await advanceTimeAndBlock(MONTH, web3)
  console.log("8 - Finish advance block and time\n")

  console.log("\n9 - Get distribution count")
  const distCount2 = await hodlDex.distributionCount(ASSET_ID_HODL)
  console.log("Distribution Count After advanceTimeAndBlock 1: " + distCount2)
  console.log("\n9 - Finish getting distribution count\n")
  console.log("\n\n10 - Get distribution at index")
  try {
    const distAtInd1 = await hodlDex.distributionAtIndex(ASSET_ID_ETH, 0)
    console.log("Total Circulating Supply: " + distAtInd1.denominator + "\nDistribution ETH amount: " + distAtInd1.amount + "\nDistribution period: " + distAtInd1._period)

  } catch (error) {
    console.log(error)
  }
  console.log("\n10 - Finished getting distribution at index\n")

  try {
    const distAtInd2 = await hodlDex.distributionAtIndex(ASSET_ID_HODL, 0)
    console.log("\n\nTotal Circulating Supply: " + distAtInd2.denominator + "\nDistribution HODLC amount: " + distAtInd2.amount + "\nDistribution period: " + distAtInd2._period)

  } catch (error) {
    console.log(error)
  }

  const blockA = await web3.eth.getBlockNumber();
  const dateA = await web3.eth.getBlock(blockA)
  console.log("Block number after: " + blockA)
  console.log(dateA.timestamp)

  await hodlDex.hodlTIssue(web3.utils.toWei('1002', 'ether'), fromDoggy)
  await hodlDex.buyHodlC(web3.utils.toWei('10', 'ether'), 400000, {from:residents["shelly"].address})
  //await hodlDex.sellHodlC(web3.utils.toWei('41', 'ether'), DEFAULT_LOW_GAS, fromShelly)
  try {
    const distAtInd1 = await hodlDex.distributionAtIndex(ASSET_ID_ETH, 0)
    console.log("\n\nTotal Circulating Supply " + distAtInd1.denominator + "\nDistribution ETH amount: " + distAtInd1.amount + "\nDistribution period: " + distAtInd1._period)

  } catch (error) {
    console.log(error)
  }

  try {
    const distAtInd2 = await hodlDex.distributionAtIndex(ASSET_ID_HODL, 0)
    console.log("\n\nTotal Circulating Supply: " + distAtInd2.denominator + "\nDistribution HODLC amount: " + distAtInd2.amount + "\nDistribution period: " + distAtInd2._period)

  } catch (error) {
    console.log(error)
  }

  try {
    const distAtInd3 = await hodlDex.distributionAtIndex(ASSET_ID_HODL, 1)
    console.log("\n\nTotal Circulating Supply: " + distAtInd3.denominator + "\nDistribution HODLC amount: " + distAtInd3.amount + "\nDistribution period: " + distAtInd3._period)

  } catch (error) {
    console.log(error)
  }
  let amountInit = 40;
  for(let i = 0; i < 50; i++){
    console.log('sell hodlc', i)
    await hodlDex.sellHodlC(web3.utils.toWei(String(amountInit++), 'ether'), 400000, {from:residents["andy"].address})
    await hodlDex.sellHodlC(web3.utils.toWei(String(amountInit++), 'ether'), 400000, {from:residents["shelly"].address})
    await hodlDex.sellHodlC(web3.utils.toWei(String(amountInit++), 'ether'), 400000, {from:residents["doggy"].address})
  }

  const distCount3 = await hodlDex.distributionCount(ASSET_ID_HODL)
  console.log("\nDistribution Count After advanceTimeAndBlock 2: " + distCount3)

  await advanceTimeAndBlock(MONTH, web3)
  await hodlDex.buyHodlC(web3.utils.toWei('10', 'ether'), 400000, {from:residents["doggy"].address})
  await hodlDex.poke({from:residents["doggy"].address})
  const distCount4 = await hodlDex.distributionCount(ASSET_ID_HODL)
  console.log("Distribution Count After advanceTimeAndBlock 3: " + distCount4)
  try {
    const distAtInd3 = await hodlDex.distributionAtIndex(ASSET_ID_HODL, 1)
    console.log("\n\nTotal Circulating Supply: " + distAtInd3.denominator + "\nDistribution HODLC amount: " + distAtInd3.amount + "\nDistribution period: " + distAtInd3._period)

  } catch (error) {
    console.log(error)
  }
  process.exit(0)
}

