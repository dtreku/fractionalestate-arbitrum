// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

interface IFractionalEstate {
    function balanceOf(address account, uint256 id) external view returns (uint256);
    function totalSupply(uint256 id) external view returns (uint256);
}

contract PropertyGovernance is AccessControl, ReentrancyGuard {
    enum ProposalType { General, Renovation, Management, Sale, Distribution, Emergency }
    enum ProposalStatus { Pending, Active, Passed, Failed, Executed, Cancelled }
    
    struct Proposal {
        uint256 propertyId;
        address proposer;
        string description;
        ProposalType proposalType;
        ProposalStatus status;
        uint256 votesFor;
        uint256 votesAgainst;
        uint256 startTime;
        uint256 endTime;
        uint256 executionTime;
    }
    
    IFractionalEstate public fractionalEstate;
    uint256 public votingPeriod = 7 days;
    uint256 public executionDelay = 2 days;
    uint256 public quorumBps = 2500;
    uint256 public approvalThresholdBps = 5100;
    
    mapping(uint256 => Proposal) public proposals;
    mapping(uint256 => mapping(address => bool)) public hasVoted;
    uint256 private _nextProposalId = 1;
    
    event ProposalCreated(uint256 indexed proposalId, uint256 indexed propertyId, address proposer, string description, ProposalType proposalType);
    event VoteCast(uint256 indexed proposalId, address indexed voter, bool support, uint256 weight);
    event ProposalExecuted(uint256 indexed proposalId);
    event ProposalCancelled(uint256 indexed proposalId);
    
    constructor(address _fractionalEstate) {
        fractionalEstate = IFractionalEstate(_fractionalEstate);
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }
    
    function createProposal(uint256 _propertyId, string calldata _description, ProposalType _type) external returns (uint256 proposalId) {
        require(fractionalEstate.balanceOf(msg.sender, _propertyId) > 0, "No shares");
        require(bytes(_description).length > 0, "Empty description");
        proposalId = _nextProposalId++;
        proposals[proposalId] = Proposal({
            propertyId: _propertyId, proposer: msg.sender, description: _description, proposalType: _type,
            status: ProposalStatus.Active, votesFor: 0, votesAgainst: 0, startTime: block.timestamp,
            endTime: block.timestamp + votingPeriod, executionTime: 0
        });
        emit ProposalCreated(proposalId, _propertyId, msg.sender, _description, _type);
    }
    
    function castVote(uint256 _proposalId, bool _support) external {
        Proposal storage prop = proposals[_proposalId];
        require(prop.status == ProposalStatus.Active, "Not active");
        require(block.timestamp < prop.endTime, "Voting ended");
        require(!hasVoted[_proposalId][msg.sender], "Already voted");
        uint256 weight = fractionalEstate.balanceOf(msg.sender, prop.propertyId);
        require(weight > 0, "No voting power");
        hasVoted[_proposalId][msg.sender] = true;
        if (_support) { prop.votesFor += weight; } else { prop.votesAgainst += weight; }
        emit VoteCast(_proposalId, msg.sender, _support, weight);
    }
    
    function finalizeProposal(uint256 _proposalId) external {
        Proposal storage prop = proposals[_proposalId];
        require(prop.status == ProposalStatus.Active, "Not active");
        require(block.timestamp >= prop.endTime, "Voting ongoing");
        uint256 totalSupply = fractionalEstate.totalSupply(prop.propertyId);
        uint256 totalVotes = prop.votesFor + prop.votesAgainst;
        bool quorumReached = (totalVotes * 10000) >= (totalSupply * quorumBps);
        bool approved = totalVotes > 0 && prop.votesFor * 10000 >= totalVotes * approvalThresholdBps;
        if (quorumReached && approved) { prop.status = ProposalStatus.Passed; prop.executionTime = block.timestamp + executionDelay; }
        else { prop.status = ProposalStatus.Failed; }
    }
    
    function executeProposal(uint256 _proposalId) external nonReentrant {
        Proposal storage prop = proposals[_proposalId];
        require(prop.status == ProposalStatus.Passed, "Not passed");
        require(block.timestamp >= prop.executionTime, "Too early");
        prop.status = ProposalStatus.Executed;
        emit ProposalExecuted(_proposalId);
    }
    
    function cancelProposal(uint256 _proposalId) external {
        Proposal storage prop = proposals[_proposalId];
        require(msg.sender == prop.proposer || hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "Not authorized");
        require(prop.status == ProposalStatus.Active || prop.status == ProposalStatus.Passed, "Cannot cancel");
        prop.status = ProposalStatus.Cancelled;
        emit ProposalCancelled(_proposalId);
    }
    
    function getProposal(uint256 _proposalId) external view returns (Proposal memory) { return proposals[_proposalId]; }
}
