exports.up = async (knex) => {
  await knex.raw(`
    CREATE TABLE tops
    (
      id BIGINT NOT NULL DEFAULT lemoncat.next_id(),
      name TEXT,
      year TEXT,
      data JSON,
      created_at timestamptz DEFAULT now(),
      updated_at timestamptz DEFAULT now()
    )
  `);
};

exports.down = async (knex) => {
  await knex.raw(`
    DROP TABLE tops
  `);
};
