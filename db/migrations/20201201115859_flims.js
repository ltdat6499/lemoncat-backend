exports.up = async (knex) => {
  await knex.raw(`
    CREATE TABLE flims 
    (
      id TEXT PRIMARY KEY,
      type TEXT DEFAULT 'movie',
      info JSON,
      what_to_knows JSON[],
      streamings TEXT[],
      photos TEXT[],
      crews JSON[],
      quotes JSON[],
      data JSON[],
      lemon_score INT DEFAULT 0,
      user_score INT DEFAULT 0,
      status BOOL DEFAULT TRUE,
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
