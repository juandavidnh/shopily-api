module.exports = {
    PORT: process.env.PORT || 8000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    DATABASE_URL: process.env.DATABASE_URL || 'postgresql://juan_david_dev@localhost/shopily',
    TEST_DATABASE_URL: process.env.TEST_DATABASE_URL || 'postgresql://juan_david_dev@localhost/shopily-test',
    JWT_SECRET: process.env.JWT_SECRET || 'test_jwt_secret'
}