exports.up = async (knex) => {
  await knex.raw(`
    CREATE TABLE comments
    (
      id BIGINT NOT NULL DEFAULT lemoncat.next_id(),
      parent_type TEXT,
      parent BIGINT,
      uid BIGINT,
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
