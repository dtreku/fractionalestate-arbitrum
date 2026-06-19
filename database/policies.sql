-- Row Level Security Policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE investments ENABLE ROW LEVEL SECURITY;
ALTER TABLE dividends ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE ipfs_files ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read users" ON users FOR SELECT USING (true);
CREATE POLICY "Anyone can insert users" ON users FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can read properties" ON properties FOR SELECT USING (true);
CREATE POLICY "Anyone can insert properties" ON properties FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update properties" ON properties FOR UPDATE USING (true);
CREATE POLICY "Anyone can read investments" ON investments FOR SELECT USING (true);
CREATE POLICY "Anyone can insert investments" ON investments FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can read dividends" ON dividends FOR SELECT USING (true);
CREATE POLICY "Anyone can insert dividends" ON dividends FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can read proposals" ON proposals FOR SELECT USING (true);
CREATE POLICY "Anyone can insert proposals" ON proposals FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update proposals" ON proposals FOR UPDATE USING (true);
CREATE POLICY "Anyone can read votes" ON votes FOR SELECT USING (true);
CREATE POLICY "Anyone can insert votes" ON votes FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can read ipfs_files" ON ipfs_files FOR SELECT USING (true);
CREATE POLICY "Anyone can insert ipfs_files" ON ipfs_files FOR INSERT WITH CHECK (true);
