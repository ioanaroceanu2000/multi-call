const Token = artifacts.require('Token.sol');
const ethers = require('ethers');

const { abi } = require('../build/contracts/Token.json');
const { bytecode } =  require('../build/contracts/CallContract.json');
const { defaultAbiCoder, Interface } = require ("ethers/lib/utils");

contract('CallContract', accounts => {

  // declaring "global" variables
  let token0, token1; // token contracts instances
  let provider; // Ganache
  let tokenInterface; // Ethers contract interface
  let myAccount; // address to be checked

  /* before running the actual test, do: */
  before(async () => {
    // deploy tokens and get their instances
    token0 = await Token.new("Token0", "TKN0");
    token1 = await Token.new("Token1", "TKN1");
    tokenInterface = new Interface(abi); // create token interface

    // set provider
    provider = new ethers.providers.JsonRpcProvider("http://localhost:7545");

    // send tokens to account to be checked
    myAccount = accounts[1];
    await token0.transfer(myAccount, 200);
    await token1.transfer(myAccount, 670);
  });

  /* The actual test */
  it('should read the 2 token balances', async () => {

    /*****Compute arguments to pass to CallHelper contract******/

    // get each token's address
    let addToken0 = token0.address
    let addToken1 = token1.address;

    // encode function call (2nd param) - used to do the low level call
    let dataCall0 = tokenInterface.encodeFunctionData('balanceOf', [myAccount]);
    let dataCall1 = tokenInterface.encodeFunctionData('balanceOf', [myAccount]);

    /******Concatenate CallHelper bytecode with abi encoding of arguments******/

    // encode list of constructor arguments
    let inputData = defaultAbiCoder.encode(["address", "bytes", "address", "bytes"],
                [addToken0, dataCall0, addToken1, dataCall1]);

    // combine CallContract bytecode with constructor parameters
    const fulldata = bytecode.concat(inputData.slice(2)); // slice the 0x prefix
    const encodedReturnData = await provider.call({data: fulldata});


    /****Decode result*****/

    console.log("Encoded data");
    const [decoded] = defaultAbiCoder.decode(['bytes[]'], encodedReturnData);
    console.log(decoded);
    let result0 = tokenInterface.decodeFunctionResult('balanceOf', decoded[0]);
    let result1 = tokenInterface.decodeFunctionResult('balanceOf', decoded[1]);

    assert.equal(result0[0].toNumber(), 200, "Account does not own 200 of Token0");
    assert.equal(result1[0].toNumber(), 670, "Account does not own 670 of Token1");

  });
});
