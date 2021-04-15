exports.up = async (knex) => {
  await knex.raw(`
    CREATE TABLE comments
    (
      id SERIAL PRIMARY KEY,
      post INT,
      uid INT,
      interact BOOL DEFAULT FALSE,
      content TEXT,
      sub_comments JSON,
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
