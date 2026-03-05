-- Create Admin User
INSERT INTO Users (Name, Email, Phone, PasswordHash, Role, IsActive, IsVerified, IsBanned, CreatedAt, IsEmailVerified)
VALUES (
    'Admin',
    'admin@wheelshare.com',
    '9999999999',
    '$2a$11$rQZJkHxGkqpTYrQY5Y5Y5eOYrQY5Y5Y5eOYrQY5Y5Y5eOYrQY5Y5Y5e', -- BCrypt hash for 'Admin@123'
    'ADMIN',
    1,
    1,
    0,
    NOW(),
    1
);