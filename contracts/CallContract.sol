pragma solidity 0.8.0;

contract CallContract {


  constructor( address contract0, bytes memory args0,
     address  contract1, bytes memory args1) public{

    // PART 1
    bytes[] memory returnDatas = new bytes[](2);
    returnDatas[0] = bytes("");
    returnDatas[1] = bytes("");

    // PART 2
    (bool success0, bytes memory returnData0) = contract0.call(args0);
    if (success0){
      returnDatas[0] = returnData0;
    }

    (bool success1, bytes memory returnData1) = contract1.call(args1);
    if (success1) {
      returnDatas[1] = returnData1;
    }

    // PART 3
    bytes memory data = abi.encode(returnDatas);

    assembly {
      return(add(data,32), 256)
    }

  }
}
