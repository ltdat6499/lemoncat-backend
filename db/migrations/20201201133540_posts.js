exports.up = async (knex) => {
  await knex.raw(`
    CREATE TABLE posts 
    (
      id TEXT PRIMARY KEY,
      uid TEXT NOT NULL,
      title TEXT,
      content TEXT,
      content_html TEXT,
      tags TEXT[],
      score INT DEFAULT 50,
      interact TEXT,
      category TEXT DEFAULT 'Review',
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
