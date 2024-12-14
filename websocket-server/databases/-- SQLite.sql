-- SQLite
SELECT id, name, password, createdAt, role
FROM users;

UPDATE users SET role = 'admin' WHERE name = 'Test1';