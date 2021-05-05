exports.up = async (knex) => {
  await knex.raw(`ALTER TABLE users 
  RENAME COLUMN token TO login_data;`);
};

exports.down = async (knex) => {};
