-- Sample seed data
INSERT INTO properties (on_chain_id, name, description, location, property_type, total_shares, available_shares, price_per_share, total_value, annual_yield, status)
VALUES 
(1, 'Downtown Boston Retail', 'Prime retail space in downtown Boston', 'Boston, MA', 'Commercial', 1000, 750, 0.1, 100.0, 8.5, 'active'),
(2, 'Cambridge Tech Office', 'Modern office near MIT', 'Cambridge, MA', 'Commercial', 2000, 1500, 0.15, 300.0, 7.2, 'active'),
(3, 'Beacon Hill Apartments', 'Historic brownstone apartments', 'Boston, MA', 'Residential', 500, 500, 0.2, 100.0, 6.8, 'active');

INSERT INTO users (wallet_address, email, full_name, kyc_status, is_accredited, jurisdiction)
VALUES ('0x0000000000000000000000000000000000000001', 'demo@example.com', 'Demo User', 'verified', true, 'US');

SELECT 'Seed data inserted' AS status;
