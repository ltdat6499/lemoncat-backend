exports.up = async (knex) => {
  await knex.raw(`
    CREATE TABLE actions
    (
      id BIGINT NOT NULL PRIMARY KEY DEFAULT lemoncat.next_id(),
      type TEXT,
      parent_type TEXT,
      parent BIGINT,
      uid BIGINT,
      data TEXT,
      score TEXT,
      post TEXT,
      created_at timestamptz DEFAULT now(),
      updated_at timestamptz DEFAULT now()
    )
  `);
};

exports.down = async (knex) => {
  await knex.raw(`
    DROP TABLE actions
  `);
};
