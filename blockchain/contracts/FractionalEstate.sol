// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

interface IInvestorRegistry {
    function isVerified(address investor) external view returns (bool);
}

contract FractionalEstate is ERC1155, ERC1155Supply, AccessControl, Pausable, ReentrancyGuard {
    bytes32 public constant PROPERTY_MANAGER_ROLE = keccak256("PROPERTY_MANAGER_ROLE");
    
    struct Property {
        string metadataURI;
        uint256 totalShares;
        uint256 availableShares;
        uint256 pricePerShare;
        uint256 totalDividends;
        bool isActive;
        address propertyManager;
    }
    
    mapping(uint256 => Property) public properties;
    mapping(uint256 => mapping(address => uint256)) public lastClaimedDividend;
    mapping(uint256 => mapping(uint256 => uint256)) public dividendPerShare;
    mapping(uint256 => uint256) public currentDividendIndex;
    
    uint256 public platformFeeBps = 250;
    address public treasury;
    IInvestorRegistry public investorRegistry;
    uint256 private _nextPropertyId = 1;
    
    event PropertyListed(uint256 indexed propertyId, string metadataURI, uint256 totalShares, uint256 pricePerShare);
    event SharesPurchased(uint256 indexed propertyId, address indexed buyer, uint256 shares, uint256 totalCost);
    event DividendDeclared(uint256 indexed propertyId, uint256 dividendIndex, uint256 totalAmount, uint256 amountPerShare);
    event DividendsClaimed(uint256 indexed propertyId, address indexed investor, uint256 amount);
    event MetadataUpdated(uint256 indexed propertyId, string newURI);
    
    constructor(address _treasury, address _investorRegistry) ERC1155("") {
        require(_treasury != address(0), "Invalid treasury");
        treasury = _treasury;
        investorRegistry = IInvestorRegistry(_investorRegistry);
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(PROPERTY_MANAGER_ROLE, msg.sender);
    }
    
    function listProperty(string calldata _metadataURI, uint256 _totalShares, uint256 _pricePerShare) 
        external onlyRole(PROPERTY_MANAGER_ROLE) whenNotPaused returns (uint256 propertyId) 
    {
        require(bytes(_metadataURI).length > 0, "Empty URI");
        require(_totalShares > 0 && _pricePerShare > 0, "Invalid params");
        propertyId = _nextPropertyId++;
        properties[propertyId] = Property(_metadataURI, _totalShares, _totalShares, _pricePerShare, 0, true, msg.sender);
        emit PropertyListed(propertyId, _metadataURI, _totalShares, _pricePerShare);
    }
    
    function purchaseShares(uint256 _propertyId, uint256 _shares) external payable nonReentrant whenNotPaused {
        require(investorRegistry.isVerified(msg.sender), "Not verified");
        Property storage prop = properties[_propertyId];
        require(prop.isActive && _shares > 0 && _shares <= prop.availableShares, "Invalid purchase");
        uint256 totalCost = _shares * prop.pricePerShare;
        require(msg.value >= totalCost, "Insufficient payment");
        uint256 fee = (totalCost * platformFeeBps) / 10000;
        prop.availableShares -= _shares;
        _mint(msg.sender, _propertyId, _shares, "");
        if (fee > 0) { (bool s1,) = treasury.call{value: fee}(""); require(s1, "Fee failed"); }
        (bool s2,) = prop.propertyManager.call{value: totalCost - fee}(""); require(s2, "Payment failed");
        if (msg.value > totalCost) { (bool s3,) = msg.sender.call{value: msg.value - totalCost}(""); require(s3, "Refund failed"); }
        emit SharesPurchased(_propertyId, msg.sender, _shares, totalCost);
    }
    
    function declareDividend(uint256 _propertyId) external payable onlyRole(PROPERTY_MANAGER_ROLE) whenNotPaused {
        Property storage prop = properties[_propertyId];
        require(prop.isActive && msg.value > 0, "Invalid dividend");
        uint256 soldShares = prop.totalShares - prop.availableShares;
        require(soldShares > 0, "No shares sold");
        uint256 amountPerShare = msg.value / soldShares;
        uint256 idx = currentDividendIndex[_propertyId]++;
        dividendPerShare[_propertyId][idx] = amountPerShare;
        prop.totalDividends += msg.value;
        emit DividendDeclared(_propertyId, idx, msg.value, amountPerShare);
    }
    
    function claimDividends(uint256 _propertyId) external nonReentrant whenNotPaused {
        uint256 shares = balanceOf(msg.sender, _propertyId);
        require(shares > 0, "No shares");
        uint256 lastClaimed = lastClaimedDividend[_propertyId][msg.sender];
        uint256 currIdx = currentDividendIndex[_propertyId];
        require(lastClaimed < currIdx, "Nothing to claim");
        uint256 total = 0;
        for (uint256 i = lastClaimed; i < currIdx; i++) { total += dividendPerShare[_propertyId][i] * shares; }
        lastClaimedDividend[_propertyId][msg.sender] = currIdx;
        (bool success,) = msg.sender.call{value: total}(""); require(success, "Transfer failed");
        emit DividendsClaimed(_propertyId, msg.sender, total);
    }
    
    function getClaimableDividends(uint256 _propertyId, address _investor) external view returns (uint256 amount) {
        uint256 shares = balanceOf(_investor, _propertyId);
        if (shares == 0) return 0;
        uint256 lastClaimed = lastClaimedDividend[_propertyId][_investor];
        for (uint256 i = lastClaimed; i < currentDividendIndex[_propertyId]; i++) { amount += dividendPerShare[_propertyId][i] * shares; }
    }
    
    function updateMetadata(uint256 _propertyId, string calldata _newURI) external onlyRole(PROPERTY_MANAGER_ROLE) {
        require(properties[_propertyId].isActive, "Inactive");
        properties[_propertyId].metadataURI = _newURI;
        emit MetadataUpdated(_propertyId, _newURI);
    }
    
    function uri(uint256 _propertyId) public view override returns (string memory) { return properties[_propertyId].metadataURI; }
    function getProperty(uint256 _propertyId) external view returns (Property memory) { return properties[_propertyId]; }
    function setPlatformFee(uint256 _newFeeBps) external onlyRole(DEFAULT_ADMIN_ROLE) { require(_newFeeBps <= 1000, "Too high"); platformFeeBps = _newFeeBps; }
    function pause() external onlyRole(DEFAULT_ADMIN_ROLE) { _pause(); }
    function unpause() external onlyRole(DEFAULT_ADMIN_ROLE) { _unpause(); }
    function _update(address from, address to, uint256[] memory ids, uint256[] memory values) internal override(ERC1155, ERC1155Supply) { super._update(from, to, ids, values); }
    function supportsInterface(bytes4 interfaceId) public view override(ERC1155, AccessControl) returns (bool) { return super.supportsInterface(interfaceId); }
}
