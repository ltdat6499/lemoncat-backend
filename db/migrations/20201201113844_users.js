exports.up = async (knex) => {
  await knex.raw(`
    CREATE TABLE users 
    (
      id SERIAL PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      password TEXT,
      name TEXT,
      image JSON,
      token TEXT,
      status BOOL DEFAULT true,
      role TEXT NOT NULL DEFAULT 'user',
      elo JSON,
      otp TEXT,
      created_at timestamptz DEFAULT now(),
      updated_at timestamptz DEFAULT now()
    )
  `);
};

exports.down = async (knex) => {
  await knex.raw(`
    DROP TABLE users
  `);
};
