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
        mapping(address => bool) validated;
    }

    mapping(uint256 => Cert) private certs;
    mapping(address => bool) private _isBoardMember;
    address[] private boardMembers;

    modifier isBoardMember() {
        require(isBoardMember[msg.sender], "You are not a board member");
        _;
    }

    constructor() ERC721("Verified Certificate", "VRC") {
        _isBoardMember[msg.sender] = true;
        boardMembers.push(msg.sender);
    }

    /// @dev Mint new NFT
    /// @notice Token Uri needs to non-empty and valid
    function mint(string calldata _tokenURI) public returns (uint256) {
        require(bytes(_tokenURI).length > 8, "Enter a valid token uri"); //ipfs uri on frontend starts with "https://"
        uint256 id = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(msg.sender, id);
        _setTokenURI(id, _tokenURI);

        // create cert here
        Cert storage currentCert = certs[id];
        currentCert.certId = id;
        currentCert.owner = msg.sender;

        return (id);
    }

    /// @dev Add a new board member that can verify certificates
    function addBoardMember(address _memberAddress) public isBoardMember {
        require(_memberAddress != address(0), "Error: Address zero is not a valid address");
        boardMembers.push(_memberAddress);
    }

    /// @dev allow bord members to verify a certificate
    function verifyCertificate(uint256 certId) public isBoardMember {
        require(_exists(certId), "Query of nonexistent certificate");
        Cert storage cert = certs[certId];
        require(!cert.validated[msg.sender], "You can't validate a certificate more than once");
        cert.validated[msg.sender] = true;
        certs[certId].validators.push(msg.sender);
    }

    /// @dev Get all board members
    function getBoardMembers() public view returns (address[] memory) {
        return boardMembers;
    }

    /// @dev Get all certificates from storage
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
