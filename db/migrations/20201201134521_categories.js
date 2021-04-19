exports.up = async (knex) => {
  await knex.raw(`
    CREATE TABLE categories 
    (
      id TEXT PRIMARY KEY,
      name TEXT DEFAULT '',
      description TEXT DEFAULT '',
      alias TEXT DEFAULT '',
      type TEXT DEFAULT '',
      created_at timestamptz DEFAULT now(),
      updated_at timestamptz DEFAULT now()
    )
  `);
};

exports.down = async (knex) => {
  await knex.raw(`
    DROP TABLE categories
  `);
};
