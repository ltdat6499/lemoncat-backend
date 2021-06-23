exports.up = async (knex) => {
  await knex.raw(`
    CREATE TABLE users 
    (
      id BIGINT NOT NULL PRIMARY KEY DEFAULT lemoncat.next_id(),
      email TEXT NOT NULL UNIQUE,
      password TEXT,
      name TEXT,
      image TEXT,
      login_data jsonb DEFAULT NULL,
      status BOOL DEFAULT true,
      role TEXT DEFAULT 'user',
      data jsonb,
      slug TEXT NOT NULL UNIQUE,
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
