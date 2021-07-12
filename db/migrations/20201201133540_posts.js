exports.up = async (knex) => {
  await knex.raw(`
    CREATE TABLE posts 
    (
      id BIGINT NOT NULL PRIMARY KEY DEFAULT lemoncat.next_id(),
      type TEXT DEFAULT 'review',
      uid BIGINT NOT NULL,
      title TEXT,
      content TEXT,
      data jsonb,
      tags TEXT[],
      slug TEXT,
      score TEXT,
      status BOOL DEFAULT TRUE,
      created_at timestamptz DEFAULT now(),
      updated_at timestamptz DEFAULT now()
    )
  `);
};

exports.down = async (knex) => {
  await knex.raw(`
    DROP TABLE posts
  `);
};
