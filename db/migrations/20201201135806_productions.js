exports.up = async (knex) => {
  await knex.raw(`
    CREATE TABLE productions
    (
      id SERIAL PRIMARY KEY,
      movie INT,
      person INT,
      type TEXT DEFAULT 'actors',
      character TEXT,
      created_at timestamptz DEFAULT now(),
      updated_at timestamptz DEFAULT now()
    )
  `);
};

exports.down = async (knex) => {
  await knex.raw(`
    DROP TABLE productions
  `);
};
