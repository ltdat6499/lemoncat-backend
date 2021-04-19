exports.up = async (knex) => {
  await knex.raw(`
    CREATE TABLE comments
    (
      id TEXT PRIMARY KEY,
      parent TEXT,
      parent_type TEXT,
      uid TEXT,
      interact TEXT,
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
