// SPDX-License-Identifier: GPL-3.0
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
pragma solidity ^0.8.0;

contract trade is ERC721URIStorage  {

    constructor() ERC721("NFTs","DJY") {

    }

    struct nft {
        uint id;
        string ipfsHash;
        address owner;
        uint fixedPrice;
        //bool onMortgage;
        uint mortgageAmount;

    }

    uint public nft_id=1;
    
    mapping(uint=> nft) public nftDetails;

    mapping(address=> nft[]) public mynfts;

    mapping(address => uint[]) public mynftids;

    mapping(address=>mapping(uint=> uint)) public mynftlocation;

    event buyNFTevent(address indexed buyer,address indexed seller,uint amount,uint indexed nft_id,string sellType);
    event mortgageNFTevent(address indexed owner,uint indexed nft_id,uint loan_value,string sellType);

    function createNFT (string memory _ipfsHash) public {

        nft memory n=nft(nft_id,_ipfsHash,msg.sender,0,0);
        _safeMint(msg.sender,nft_id);
        _setTokenURI(nft_id,_ipfsHash);
        nftDetails[nft_id]=n;
        mynfts[msg.sender].push(n);
        mynftids[msg.sender].push(nft_id);
        mynftlocation[msg.sender][nft_id]=mynftids[msg.sender].length;
        nft_id+=1;
    }

    function listNFT (uint _id,uint _fixedPrice) public {
        
        nftDetails[_id].fixedPrice=_fixedPrice;
    }
    
    function buyNFT(uint _id,address buyer,address seller,uint _amount ) public payable {

    require(nftDetails[_id].fixedPrice==_amount,"Insufficient amount");
    
        payable(seller).transfer(_amount);
        nftDetails[_id].owner=buyer;
        nftDetails[_id].fixedPrice=0;

        uint idx=mynftlocation[seller][_id];
        nft memory last_element=mynfts[ seller ] [ mynfts[seller].length - 1 ];
        uint last_element_id=mynftids[seller][mynftids[seller].length-1];

        mynfts[ seller ] [ idx-1 ] = last_element;
        mynfts[ seller ] . pop();
        mynftids[seller][idx-1]=last_element_id;
        mynftids[seller].pop();

        mynftlocation[seller][_id] = 0 ;
        mynftlocation[seller][last_element_id]=idx;

        mynfts[ buyer].push(nftDetails[_id]);
        mynftids[buyer].push(_id);
        mynftlocation[buyer][_id]=mynfts[buyer].length;

        _transfer(address(this), buyer, _id);

        emit buyNFTevent(buyer,seller,_amount,_id,"Fixed price auction");

    }

    function placeBid() public payable {
        
    }

    function getNFTs(address _owner) public view returns(nft[] memory) {
    
        return mynfts[_owner];
    }

    function mortgageNFT (uint _id,uint _loanvalue) public {
        
        nftDetails[_id].mortgageAmount=_loanvalue;
        payable(nftDetails[_id].owner).transfer(_loanvalue);
        emit mortgageNFTevent(msg.sender,_id,_loanvalue,"Auction");
    }

}
