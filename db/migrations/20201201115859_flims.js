exports.up = async (knex) => {
  await knex.raw(`
    CREATE TABLE flims 
    (
      id BIGINT NOT NULL PRIMARY KEY DEFAULT lemoncat.next_id(),
      type TEXT DEFAULT 'movie',
      info jsonb,
      what_to_knows jsonb[],
      streamings TEXT[],
      photos TEXT[],
      crews jsonb[],
      quotes jsonb[],
      data jsonb,
      lemon_score INT DEFAULT 0,
      user_score INT DEFAULT 0,
      status BOOL DEFAULT TRUE,
      slug TEXT,
      crawl_data jsonb,
      created_at timestamptz DEFAULT now(),
      updated_at timestamptz DEFAULT now()
    )
    `);
};

exports.down = async (knex) => {
  await knex.raw(`
    DROP TABLE flims
    `);
};
