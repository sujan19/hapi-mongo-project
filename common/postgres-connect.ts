import * as pg from 'pg';

export const pool = new pg.Pool({
    user: 'postgres',
    password: 'password',
    port: 5432,
    database: 'school',
    host: 'localhost',
})

pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err)
    process.exit(-1)
})

pool.connect().then(()=>console.log('Postgres DB connected successfully'));





