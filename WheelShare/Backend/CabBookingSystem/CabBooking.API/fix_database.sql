-- Add missing columns to DriverProfiles table
USE CabBookingDB;

-- Check if columns exist before adding them
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'DriverProfiles' AND COLUMN_NAME = 'FullName')
BEGIN
    ALTER TABLE DriverProfiles ADD FullName nvarchar(max) NOT NULL DEFAULT '';
END

IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'DriverProfiles' AND COLUMN_NAME = 'PhoneNumber')
BEGIN
    ALTER TABLE DriverProfiles ADD PhoneNumber nvarchar(max) NOT NULL DEFAULT '';
END

-- Insert migration record
IF NOT EXISTS (SELECT * FROM __EFMigrationsHistory WHERE MigrationId = '20241229000000_AddDriverProfileColumns')
BEGIN
    INSERT INTO __EFMigrationsHistory (MigrationId, ProductVersion) 
    VALUES ('20241229000000_AddDriverProfileColumns', '8.0.22');
END

PRINT 'Migration completed successfully';