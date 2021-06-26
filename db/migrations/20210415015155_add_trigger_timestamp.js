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

  await knex.raw(`CREATE TRIGGER flims_updated
    BEFORE UPDATE
    ON flims
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

  await knex.raw(`CREATE TRIGGER actions_updated
    BEFORE UPDATE
    ON actions
    FOR EACH ROW
    EXECUTE PROCEDURE trigger_set_timestamp()`);

  await knex.raw(`CREATE TRIGGER awards_updated
    BEFORE UPDATE
    ON awards
    FOR EACH ROW
    EXECUTE PROCEDURE trigger_set_timestamp()`);
};

exports.down = async (knex) => {
  await knex.raw(`drop TRIGGER users_updated ON users`);
  await knex.raw(`drop TRIGGER flims_updated ON flims`);
  await knex.raw(`drop TRIGGER persons_updated ON persons`);
  await knex.raw(`drop TRIGGER posts_updated ON posts`);
  await knex.raw(`drop TRIGGER actions_updated ON actions`);
  await knex.raw(`drop TRIGGER awards_updated ON awards`);
};
