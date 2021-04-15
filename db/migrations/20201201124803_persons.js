exports.up = async (knex) => {
  await knex.raw(`
    CREATE TABLE persons 
    (
      id SERIAL PRIMARY KEY,
      name TEXT,
      birth TEXT,
      born_in TEXT,
      poster TEXT,
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
