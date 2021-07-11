const advanceTimeAndBlock = async (time, web3) => {
  //console.log('advanceTimeAndBlock')
  //capture current time
  //console.log('advanceTimeAndBlock', 1)
  //console.log('advanceTimeAndBlock', 2)
  //console.log('advanceTimeAndBlock', 3)
  return new Promise((resolve, reject) => {
    //console.log('advanceTimeAndBlock', 4)
    // web3.currentProvider.send({ jsonrpc: '2.0', method: 'evm_increaseTime', params: [3600], id: new Date().getTime()}, (err, res)=>console.log(err, res))
    web3.currentProvider.send({ jsonrpc: '2.0', method: 'evm_increaseTime', params: [time], id: new Date().getTime()
    }, (err, res) => {
      //console.log('advanceTimeAndBlock', 5, err, res)
      if (err) return reject(err);
      const { id } = res;
      web3.currentProvider.send({ jsonrpc: '2.0', method: 'evm_mine', id }, (err, res) => {
        //console.log('advanceTimeAndBlock', 6, err, res)
        if (err) return reject(err);
        return resolve()
      })
    })
  })
}

module.exports = advanceTimeAndBlock