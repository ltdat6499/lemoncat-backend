exports.up = async (knex) => {
  await knex.raw(`
    CREATE TABLE best_movies 
    (
      id SERIAL PRIMARY KEY,
      name TEXT,
      movie INT,
      created_at timestamptz DEFAULT now(),
      updated_at timestamptz DEFAULT now()
    )
  `);
};

exports.down = async (knex) => {
  await knex.raw(`
    DROP TABLE best_movies
  `);
};
