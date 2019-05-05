pragma solidity ^0.4.24;

/**
 * @title Ownable
 * @dev The Ownable contract has an owner address, and provides basic authorization control
 * functions, this simplifies the implementation of "user permissions".
 */
contract Ownable {

    address public owner;

    event OwnershipTransferred(
        address indexed previousOwner,
        address indexed newOwner
    );

    /**
     * @dev The Ownable constructor sets the original `owner` of the contract to the sender
     * account.
     */
    constructor() public {
        owner = msg.sender;
    }

    /**
     * @dev Throws if called by any account other than the owner.
     */
    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    /**
     * @dev Allows the current owner to transfer control of the contract to a newOwner.
     * @param _newOwner The address to transfer ownership to.
     */
    function transferOwnership(address _newOwner) public onlyOwner {
        _transferOwnership(_newOwner);
    }

    /**
     * @dev Transfers control of the contract to a newOwner.
     * @param _newOwner The address to transfer ownership to.
     */
    function _transferOwnership(address _newOwner) internal {
        require(_newOwner != address(0));
        emit OwnershipTransferred(owner, _newOwner);
        owner = _newOwner;
    }
}

contract CCGX_Swap is Ownable {

    constructor() public {

    }

    /////////////////////////////// OneToOneSwapTRC10 SWAP /////////////////////////////////////
    function OneToOneSwapTRC10(address toAddress, trcToken id) payable public    {
        uint256 toeknValue = (msg.value)/1000000;
        toAddress.transferToken(toeknValue, id);
    }
    ///////////////////////////// OneToOneSwapTRC10 SWAP END ///////////////////////////////////

    /////////////////////////////// TwoToOneSwapTRC10 SWAP /////////////////////////////////////
    function TwoToOneSwapTRC10(address toAddress, trcToken id) payable public    {
        uint256 toeknValue = (msg.value)/2000000;
        toAddress.transferToken(toeknValue, id);
    }
    ///////////////////////////// TwoToOneSwapTRC10 SWAP END ///////////////////////////////////

    /////////////////////////////// FiveToOneSwapTRC10 SWAP /////////////////////////////////////
    function FiveToOneSwapTRC10(address toAddress, trcToken id) payable public    {
        uint256 toeknValue = (msg.value)/5000000;
        toAddress.transferToken(toeknValue, id);
    }
    ///////////////////////////// FiveToOneSwapTRC10 SWAP END ///////////////////////////////////

    function getTRC10TokenBalance(trcToken id) public view returns (uint256){
        return address(this).tokenBalance(id);
    }


    /////////////////////////////// TRX MANAGEMENT /////////////////////////////////////
    // @dev Returns contract ETH balance
    function getBalance() public view returns (uint256)
    {
        return address(this).balance;
    }

    // @dev Transfers TRX from contract to specified address
    function withdrawTRX(address _address, uint256 _amount) onlyOwner public returns (uint256)
    {
        uint256 _value = _amount*(1 trx);

        // to prevent spamming
        require(_value > 1 trx, "Send at least 1 TRX");

        // transfer reward to account
        _address.transfer(_value);

    }

    // @dev Transfers TRX from specified address to contract
    function depositTRX() public payable onlyOwner returns (bool) {

        return true;
    }
    //////////////////////////// TRX MANAGEMENT END ////////////////// ////////////////

}
