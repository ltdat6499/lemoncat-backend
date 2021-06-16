exports.up = async (knex) => {
  await knex.raw(`
    CREATE TABLE posts 
    (
      id TEXT PRIMARY KEY,
      type TEXT DEFAULT 'review',
      uid TEXT NOT NULL,
      title TEXT,
      content TEXT,
      data JSON,
      network_data JSON[],
      tags TEXT[],
      interacts JSON[],
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
