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
        address beforeMortgageowner;
    }

    uint public nft_id=1;
    
    mapping(uint=> nft) public nftDetails;

    mapping(address=> nft[]) public mynfts;

    mapping(address => uint[]) public mynftids;

    mapping(address=>mapping(uint=> uint)) public mynftlocation;

    event buyNFTevent(address indexed buyer,address indexed seller,uint amount,uint indexed nft_id);
    event mortgageNFTevent(address indexed owner,uint indexed nft_id,uint loan_value);

   function contractBalance () public view returns (uint) {
       
       return address(this).balance;
   }

    function createNFT (string memory _ipfsHash) public {

        nft memory n=nft(nft_id,_ipfsHash,msg.sender,0,0,address(0));
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

        mynfts[msg.sender][mynftlocation[msg.sender][_id]-1]=nftDetails[_id];
    }
    
    function buyNFT(uint _id,address buyer,address seller,uint _amount ) public payable {

    require(nftDetails[_id].fixedPrice==_amount,"Insufficient amount");
    
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

        _transfer(seller, buyer, _id);

        emit buyNFTevent(buyer,seller,_amount,_id);
        payable(seller).transfer(_amount);

    }

    function placeBid() public payable {
        
    }

    function getNFTs(address _owner) public view returns(nft[] memory) {
    
        return mynfts[_owner];
    }

    function mortgageNFT (uint _id,uint _loanvalue,address _loanee,address _provider) public {
        
        nftDetails[_id].mortgageAmount=_loanvalue;
        nftDetails[_id].beforeMortgageowner=_loanee;
        nftDetails[_id].owner=_provider;

        uint idx=mynftlocation[_loanee][_id];
        nft memory last_element=mynfts[ _loanee ] [ mynfts[_loanee].length - 1 ];
        uint last_element_id=mynftids[_loanee][mynftids[_loanee].length-1];

        mynfts[ _loanee ] [ idx-1 ] = last_element;
        mynfts[ _loanee ] . pop();
        mynftids[_loanee][idx-1]=last_element_id;
        mynftids[_loanee].pop();

        mynftlocation[_loanee][_id] = 0 ;
        mynftlocation[_loanee][last_element_id]=idx;

        mynfts[_provider].push(nftDetails[_id]);
        mynftids[_provider].push(_id);
        mynftlocation[_provider][_id]=mynftids[_provider].length;

        payable(nftDetails[_id].beforeMortgageowner).transfer(_loanvalue);

        emit mortgageNFTevent(msg.sender,_id,_loanvalue);
        _transfer(msg.sender,address(this),_id);
    }

    function payInstallment(uint _amount,uint _id) public payable {
        
        nftDetails[_id].mortgageAmount-=_amount;
        mynfts[address(this)][mynftlocation[address(this)][_id]-1]=nftDetails[_id];

        if(nftDetails[_id].mortgageAmount==0) {

            _transfer(address(this),msg.sender,_id);
            //nftDetails[_id].onMortgage=false;
            nftDetails[_id].owner=msg.sender;
            nftDetails[_id].beforeMortgageowner=address(0);
            uint idx=mynftlocation[address(this)][_id];

            nft memory last_element=mynfts[ address(this) ] [ mynfts[address(this)].length - 1 ];
            uint last_element_id=mynftids[address(this)][mynftids[address(this)].length-1];

            mynfts[ address(this) ] [ idx-1 ] = last_element;
            mynfts[ address(this) ] . pop();
            mynftids[address(this)][idx-1]=last_element_id;
            mynftids[address(this)].pop();

            mynftlocation[address(this)][_id] = 0 ;
            mynftlocation[address(this)][last_element_id]=idx;

            mynfts[msg.sender].push(nftDetails[_id]);
            mynftids[msg.sender].push(_id);
            mynftlocation[msg.sender][_id]=mynftids[msg.sender].length;
        }
    }
}

//multiple events, string sell type,
//auction ,marketplace ids in hasura

//placeBid can be used  even for paying installments & its calculation can be done in backend

//address comparison for identifying