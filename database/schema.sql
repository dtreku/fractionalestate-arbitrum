-- FractionalEstate Database Schema for Supabase
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    wallet_address VARCHAR(42) UNIQUE NOT NULL,
    email VARCHAR(255),
    full_name VARCHAR(255),
    kyc_status VARCHAR(20) DEFAULT 'pending' CHECK (kyc_status IN ('pending', 'verified', 'rejected', 'expired')),
    is_accredited BOOLEAN DEFAULT FALSE,
    jurisdiction VARCHAR(10),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE properties (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    on_chain_id INTEGER UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    location VARCHAR(255),
    property_type VARCHAR(50),
    total_shares INTEGER NOT NULL,
    available_shares INTEGER NOT NULL,
    price_per_share DECIMAL(20, 8) NOT NULL,
    total_value DECIMAL(20, 8),
    annual_yield DECIMAL(5, 2),
    ipfs_metadata_cid VARCHAR(100),
    ipfs_image_cid VARCHAR(100),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'sold_out', 'inactive')),
    property_manager_address VARCHAR(42),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE investments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    shares_purchased INTEGER NOT NULL,
    amount_paid DECIMAL(20, 8) NOT NULL,
    price_per_share_at_purchase DECIMAL(20, 8) NOT NULL,
    tx_hash VARCHAR(66) NOT NULL,
    block_number BIGINT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE dividends (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    dividend_index INTEGER NOT NULL,
    total_amount DECIMAL(20, 8) NOT NULL,
    amount_per_share DECIMAL(20, 8) NOT NULL,
    tx_hash VARCHAR(66) NOT NULL,
    declared_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE proposals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    on_chain_id INTEGER UNIQUE NOT NULL,
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    proposer_id UUID REFERENCES users(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    proposal_type VARCHAR(20) NOT NULL,
    status VARCHAR(20) DEFAULT 'Active',
    votes_for DECIMAL(20, 8) DEFAULT 0,
    votes_against DECIMAL(20, 8) DEFAULT 0,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    execution_time TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE votes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    proposal_id UUID REFERENCES proposals(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    support BOOLEAN NOT NULL,
    voting_power DECIMAL(20, 8) NOT NULL,
    tx_hash VARCHAR(66) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(proposal_id, user_id)
);

CREATE TABLE ipfs_files (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    file_type VARCHAR(50) NOT NULL,
    ipfs_cid VARCHAR(100) NOT NULL,
    pinata_id VARCHAR(100),
    file_name VARCHAR(255),
    file_size BIGINT,
    mime_type VARCHAR(100),
    uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_users_wallet ON users(wallet_address);
CREATE INDEX idx_properties_status ON properties(status);
CREATE INDEX idx_investments_user ON investments(user_id);
CREATE INDEX idx_proposals_status ON proposals(status);

CREATE OR REPLACE FUNCTION update_updated_at() RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END; $$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_properties_updated_at BEFORE UPDATE ON properties FOR EACH ROW EXECUTE FUNCTION update_updated_at();
