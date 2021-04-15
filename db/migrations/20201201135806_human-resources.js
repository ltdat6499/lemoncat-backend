exports.up = async (knex) => {
  await knex.raw(`
    CREATE TABLE human_resources
    (
      id SERIAL PRIMARY KEY,
      movie INT,
      type TEXT DEFAULT 'Cast',
      character_name TEXT,
      person INT,
      created_at timestamptz DEFAULT now(),
      updated_at timestamptz DEFAULT now()
    )
  `);
};

exports.down = async (knex) => {
  await knex.raw(`
    DROP TABLE human_resources
  `);
};
