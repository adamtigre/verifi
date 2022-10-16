// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Verifi is ERC721, ERC721Enumerable, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;

    struct Cert {
        uint256 certId;
        address owner;
        address[] validators;
    }

    mapping(uint256 => Cert) private certs;
    address[] private boardMembers;

    modifier isBoardMember() {
        bool isMember = false;
        for (uint256 i = 0; i < boardMembers.length; i++) {
            if (boardMembers[i] == msg.sender) {
                isMember = true;
                break;
            }
        }
        require(isMember, "Only board members allowed to call this function");
        _;
    }

    constructor() ERC721("Verified Certificate", "VRC") {
        boardMembers.push(msg.sender);
    }

    // Mint new NFT
    function mint(string memory _tokenURI) public returns (uint256) {
        require(bytes(_tokenURI).length > 7, "Enter a valid token uri"); //ipfs uri starts with "ipfs://"
        uint256 id = _tokenIdCounter.current();
        _safeMint(msg.sender, id);
        _setTokenURI(id, _tokenURI);

        // create cert here
        address[] memory _validators;
        certs[id] = Cert(id, msg.sender, _validators);

        _tokenIdCounter.increment();
        return (id);
    }

    // Add a new board member that can verify certificates
    function addBoardMember(address _memberAddress) public isBoardMember {
        boardMembers.push(_memberAddress);
    }

    // Verify a certificate
    function verifyCertificate(uint256 certId) public isBoardMember {
        Cert storage cert = certs[certId];
        bool hasValidated = false;
        for (uint256 i = 0; i < cert.validators.length; i++) {
            if (cert.validators[i] == msg.sender) {
                hasValidated = true;
                break;
            }
        }

        require(
            !hasValidated,
            "You can't validate a certificate more than once"
        );
        certs[certId].validators.push(msg.sender);
    }

    // Get all board members
    function getBoardMembers() public view returns (address[] memory) {
        return boardMembers;
    }

    // Get all certificates from storage
    function getCerts() public view returns (Cert[] memory) {
        uint256 total = _tokenIdCounter.current();
        Cert[] memory certificates = new Cert[](total);
        for (uint256 i = 0; i < total; i++) {
            certificates[i] = certs[i];
        }
        return certificates;
    }

    // The following functions are overrides required by Solidity.
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function _burn(uint256 tokenId)
        internal
        override(ERC721, ERC721URIStorage)
    {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
