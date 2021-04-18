exports.up = async (knex) => {
  await knex.raw(`CREATE OR REPLACE FUNCTION trigger_set_timestamp()
  RETURNS TRIGGER AS $$
  BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
  END;
  $$ LANGUAGE plpgsql;`);

  await knex.raw(`CREATE TRIGGER users_updated
    BEFORE UPDATE
    ON users
    FOR EACH ROW
    EXECUTE PROCEDURE trigger_set_timestamp()`);

  await knex.raw(`CREATE TRIGGER movies_updated
    BEFORE UPDATE
    ON movies
    FOR EACH ROW
    EXECUTE PROCEDURE trigger_set_timestamp()`);

  await knex.raw(`CREATE TRIGGER persons_updated
    BEFORE UPDATE
    ON persons
    FOR EACH ROW
    EXECUTE PROCEDURE trigger_set_timestamp()`);

  await knex.raw(`CREATE TRIGGER posts_updated
    BEFORE UPDATE
    ON posts
    FOR EACH ROW
    EXECUTE PROCEDURE trigger_set_timestamp()`);

  await knex.raw(`CREATE TRIGGER categories_updated
    BEFORE UPDATE
    ON categories
    FOR EACH ROW
    EXECUTE PROCEDURE trigger_set_timestamp()`);

  await knex.raw(`CREATE TRIGGER productions_updated
    BEFORE UPDATE
    ON productions
    FOR EACH ROW
    EXECUTE PROCEDURE trigger_set_timestamp()`);

  await knex.raw(`CREATE TRIGGER comments_updated
    BEFORE UPDATE
    ON comments
    FOR EACH ROW
    EXECUTE PROCEDURE trigger_set_timestamp()`);

  await knex.raw(`CREATE TRIGGER best_movies_updated
    BEFORE UPDATE
    ON best_movies
    FOR EACH ROW
    EXECUTE PROCEDURE trigger_set_timestamp()`);
};

exports.down = async (knex) => {
  await knex.raw(`drop TRIGGER users_updated ON users`);
  await knex.raw(`drop TRIGGER movies_updated ON movies`);
  await knex.raw(`drop TRIGGER persons_updated ON persons`);
  await knex.raw(`drop TRIGGER posts_updated ON posts`);
  await knex.raw(`drop TRIGGER categories_updated ON categories`);
  await knex.raw(`drop TRIGGER productions_updated ON productions`);
  await knex.raw(`drop TRIGGER comments_updated ON comments`);
  await knex.raw(`drop TRIGGER best_movies_updated ON best_movies`);
};
