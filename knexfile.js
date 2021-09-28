// Update with your config settings.
require('dotenv').config();

module.exports = {

    development: {
        client: process.env.DB_CLIENT,
        connection: {
            host: process.env.DB_HOST,
            database: process.env.DB_NAME,
            user:     process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            ...(process.env.SSL_MODE === 'true' ? {
                ssl: true,
            } : {})
        },
        migrations: {
            tableName: 'knex_migrations'
        }
    },

    test: {
        client: process.env.DB_CLIENT,
        connection: {
            host: process.env.DB_HOST,
            database: process.env.DB_NAME,
            user:     process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            ...(process.env.SSL_MODE === 'true' ? {
                ssl: true,
            } : {})
        },
        migrations: {
            tableName: 'knex_migrations'
        }
    },


    staging: {
        client: 'postgresql',
        connection: {
            database: 'my_db',
            user:     'username',
            password: 'password'
        },
        pool: {
            min: 2,
            max: 10
        },
        migrations: {
            tableName: 'knex_migrations'
        }
    },

    production: {
        client: process.env.DB_CLIENT,
        connection: {
            host: process.env.DB_HOST,
            database: process.env.DB_NAME,
            user:     process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            ...(process.env.SSL_MODE === 'true' ? {
                ssl: true,
            } : {})
        },
        pool: {
            min: 2,
            max: 10
        },
        migrations: {
            tableName: 'knex_migrations'
        }
    }

};
