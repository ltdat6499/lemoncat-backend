exports.up = async (knex) => {
  await knex.raw(`
    CREATE INDEX action_index
    ON actions ("type", "parent_type", "parent");

    CREATE INDEX flim_index
    ON flims ("slug", "id", "created_at", "updated_at");

    CREATE INDEX person_index
    ON persons ("slug", "id", "name");

    CREATE INDEX post_index
    ON posts ("slug", "id", "title", "uid");
  `);
};

exports.down = async (knex) => {
  await knex.raw(`
    DROP INDEX action_index ON actions;
    DROP INDEX flim_index ON flims;
    DROP INDEX person_index ON persons;
    DROP INDEX post_index ON posts;
  `);
};
