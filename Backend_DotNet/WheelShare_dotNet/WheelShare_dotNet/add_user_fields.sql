-- Add missing columns to Users table
ALTER TABLE Users 
ADD COLUMN IsVerified TINYINT(1) NOT NULL DEFAULT 0,
ADD COLUMN IsBanned TINYINT(1) NOT NULL DEFAULT 0;

-- Update existing admin user to be verified
UPDATE Users SET IsVerified = 1 WHERE Email = 'admin@wheelshare.com';

-- Insert migration record
INSERT INTO __EFMigrationsHistory (MigrationId, ProductVersion) 
VALUES ('20260202120000_AddUserVerificationFields', '8.0.22');