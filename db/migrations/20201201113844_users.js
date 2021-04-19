exports.up = async (knex) => {
  await knex.raw(`
    CREATE TABLE users 
    (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      password TEXT,
      name TEXT,
      image JSON,
      token TEXT DEFAULT NULL,
      status BOOL DEFAULT true,
      role TEXT DEFAULT 'user',
      elo JSON DEFAULT NULL,
      otp TEXT DEFAULT NULL,
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
