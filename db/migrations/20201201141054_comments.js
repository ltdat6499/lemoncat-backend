exports.up = async (knex) => {
  await knex.raw(`
    CREATE TABLE comments
    (
      id SERIAL PRIMARY KEY,
      parent INT,
      parent_type TEXT,
      uid INT,
      interact BOOL DEFAULT FALSE,
      content TEXT,
      created_at timestamptz DEFAULT now(),
      updated_at timestamptz DEFAULT now()
    )
  `);
};

exports.down = async (knex) => {
  await knex.raw(`
    DROP TABLE comments
  `);
};
