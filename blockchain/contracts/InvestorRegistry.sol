// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

contract InvestorRegistry is AccessControl, Pausable {
    bytes32 public constant COMPLIANCE_ROLE = keccak256("COMPLIANCE_ROLE");
    
    struct Investor {
        bool isVerified;
        bool isAccredited;
        uint256 verifiedAt;
        uint256 expiresAt;
        string jurisdiction;
    }
    
    mapping(address => Investor) public investors;
    uint256 public verificationPeriod = 365 days;
    
    event InvestorVerified(address indexed investor, bool isAccredited, string jurisdiction, uint256 expiresAt);
    event InvestorRevoked(address indexed investor, string reason);
    
    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(COMPLIANCE_ROLE, msg.sender);
    }
    
    function verifyInvestor(address _investor, bool _isAccredited, string calldata _jurisdiction) external onlyRole(COMPLIANCE_ROLE) whenNotPaused {
        require(_investor != address(0), "Invalid address");
        uint256 expiresAt = block.timestamp + verificationPeriod;
        investors[_investor] = Investor(true, _isAccredited, block.timestamp, expiresAt, _jurisdiction);
        emit InvestorVerified(_investor, _isAccredited, _jurisdiction, expiresAt);
    }
    
    function revokeVerification(address _investor, string calldata _reason) external onlyRole(COMPLIANCE_ROLE) {
        require(investors[_investor].isVerified, "Not verified");
        delete investors[_investor];
        emit InvestorRevoked(_investor, _reason);
    }
    
    function isVerified(address _investor) external view returns (bool) {
        Investor memory inv = investors[_investor];
        return inv.isVerified && block.timestamp < inv.expiresAt;
    }
    
    function isAccredited(address _investor) external view returns (bool) {
        Investor memory inv = investors[_investor];
        return inv.isVerified && inv.isAccredited && block.timestamp < inv.expiresAt;
    }
    
    function getInvestor(address _investor) external view returns (Investor memory) {
        return investors[_investor];
    }
    
    function pause() external onlyRole(DEFAULT_ADMIN_ROLE) { _pause(); }
    function unpause() external onlyRole(DEFAULT_ADMIN_ROLE) { _unpause(); }
}
