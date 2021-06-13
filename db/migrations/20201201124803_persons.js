exports.up = async (knex) => {
  await knex.raw(`
    CREATE TABLE persons 
    (
      id TEXT PRIMARY KEY,
      name TEXT,
      birth DATE,
      born_in TEXT,
      summary TEXT,
      images TEXT[],
      created_at timestamptz DEFAULT now(),
      updated_at timestamptz DEFAULT now()
    )
  `);
};

exports.down = async (knex) => {
  await knex.raw(`
    DROP TABLE persons
  `);
};
