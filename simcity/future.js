//
// 1. you have balance
// 2.

// const timeMachine = require('ganache-time-traveler');

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
const { provider, residents, fromDoggy, fromAndy, fromShelly } = require('./neighborhood')
const advanceTimeAndBlock = require('./time-travel')

const ASSET_ID_HODL = "0xf0a5429dabc7f51d218d3119bc4ca776cb42abb5725ccd62a1577f01f196508e"
const ASSET_ID_ETH  = "0x4c10068c4e8f0b2905447ed0a679a3934513092c8a965b7a3d1ea67ea1cd0698"
const MONTH = 60 * 60 * 24 * 31;
const DEFAULT_LOW_GAS = '200000';

module.exports = async (config) => {
  HOracle.setProvider(provider);
  HodlDex.setProvider(provider);
  HTokenReserve.setProvider(provider);
  HodlDexProxyAdmin.setProvider(provider);
  HTokenReserveProxyAdmin.setProvider(provider);
  ProportionalTest.setProvider(provider);
  console.log(1)
  console.log(2)
  const tokenReserveProxy = await HTokenReserveProxy.deployed();
  console.log(3)
  const hodlDexProxy = await HodlDexProxy.deployed();
  console.log(4)
  const hodlDexProxyAdmin = await HodlDexProxyAdmin.deployed();
  console.log(5)
  const upgradableTokenReserve = await HTokenReserve.at(tokenReserveProxy.address);
  console.log(6)
  const upgradableHodlDex = await HodlDex.at(hodlDexProxy.address)
  console.log(7)
  const hodlDex = await HodlDex.at(hodlDexProxy.address)
  const tokenAddress = await upgradableTokenReserve.erc20Token();
  console.log(8)
  const MIGRATION_ROLE = await hodlDex.MIGRATION_ROLE()
  console.log(9)
  const ADMIN = residents['mayor'].address
  console.log(10)
  // andy buy 10 orders
  console.log(11)
  const REDEEM_AMOUNT = web3.utils.toWei('500', 'ether')
  await hodlDex.buyHodlC(web3.utils.toWei('0.1', 'ether'), DEFAULT_LOW_GAS, fromAndy)
  await hodlDex.buyHodlC(web3.utils.toWei('0.1', 'ether'), DEFAULT_LOW_GAS, fromAndy)
  await hodlDex.buyHodlC(web3.utils.toWei('0.1', 'ether'), DEFAULT_LOW_GAS, fromAndy)
  await hodlDex.buyHodlC(web3.utils.toWei('0.1', 'ether'), DEFAULT_LOW_GAS, fromAndy)
  console.log(12)
  // try {
  //   await hodlT.approve(tokenReserveProxy.address, REDEEM_AMOUNT, fromAndy)
  // }catch (e) {
  //   console.error(e)
  // }
  // try {
  //   await hodlDex.hodlTRedeem(REDEEM_AMOUNT, fromAndy)
  // }
  // catch (e) {
  //   console.error(e)
  // }
  // await hodlDex.hodlTRedeem(REDEEM_AMOUNT, fromAndy)
  // await hodlDex.hodlTRedeem(REDEEM_AMOUNT, fromAndy)
  // await hodlDex.hodlTRedeem(REDEEM_AMOUNT, fromAndy)

  //await advanceTimeAndBlock(MONTH, web3)

  // await hodlDex.hodlTRedeem(REDEEM_AMOUNT, fromAndy)
  // await hodlDex.hodlTRedeem(REDEEM_AMOUNT, fromAndy)

  console.log(13)
  //await advanceTimeAndBlock(MONTH, web3)
  console.log(14)
  // try {
  //   await hodlDex.buyHodlC(web3.utils.toWei('0.1', 'ether'), DEFAULT_LOW_GAS, fromShelly)
  // }catch (e) {
  //   console.error(e)
  // }
  // console.log(15)
  await hodlDex.buyHodlC(web3.utils.toWei('0.1', 'ether'), DEFAULT_LOW_GAS, fromShelly)
  await hodlDex.buyHodlC(web3.utils.toWei('0.1', 'ether'), DEFAULT_LOW_GAS, fromShelly)
  await hodlDex.buyHodlC(web3.utils.toWei('0.1', 'ether'), DEFAULT_LOW_GAS, fromShelly)
  // await hodlT.approve(tokenReserveProxy.address, REDEEM_AMOUNT, fromShelly)
  // await hodlDex.hodlTRedeem(REDEEM_AMOUNT, fromShelly)
  // await hodlDex.hodlTRedeem(REDEEM_AMOUNT, fromShelly)
  // await hodlDex.hodlTRedeem(REDEEM_AMOUNT, fromShelly)

  await hodlDex.buyHodlC(web3.utils.toWei('0.1', 'ether'), DEFAULT_LOW_GAS, fromDoggy)
  await hodlDex.buyHodlC(web3.utils.toWei('0.1', 'ether'), DEFAULT_LOW_GAS, fromDoggy)
  await hodlDex.buyHodlC(web3.utils.toWei('0.1', 'ether'), DEFAULT_LOW_GAS, fromDoggy)
  await hodlDex.buyHodlC(web3.utils.toWei('0.1', 'ether'), DEFAULT_LOW_GAS, fromDoggy)
  // await hodlT.approve(tokenReserveProxy.address, REDEEM_AMOUNT, fromDoggy)
  // await hodlDex.hodlTRedeem(REDEEM_AMOUNT, fromDoggy)
  // await hodlDex.hodlTRedeem(REDEEM_AMOUNT, fromDoggy)
  // await hodlDex.hodlTRedeem(REDEEM_AMOUNT, fromDoggy)

  //await advanceTimeAndBlock(MONTH, web3)
  process.exit(0)
}

