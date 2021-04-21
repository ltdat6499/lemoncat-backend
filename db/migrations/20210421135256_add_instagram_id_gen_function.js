
exports.up = function(knex) {
  await knex.raw(`CREATE SCHEMA lemoncat`);
  await knex.raw(`CREATE SEQUENCE lemoncat.table_id_seq`);
  await knex.raw(
    `CREATE OR REPLACE FUNCTION lemoncat.next_id(OUT result bigint) AS $$
    DECLARE
        our_epoch bigint := 1577836800000;
        seq_id bigint;
        now_millis bigint;
        shard_id int := 0;
    BEGIN
        SELECT nextval('lemoncat.table_id_seq') % 1024 INTO seq_id;
        SELECT FLOOR(EXTRACT(EPOCH FROM clock_timestamp()) * 1000) INTO now_millis;
        result := (now_millis - our_epoch) << 10;
        result := result | (shard_id << 5);
        result := result | (seq_id);
    END;
        $$ LANGUAGE PLPGSQL`
  );
};

exports.down = function(knex) {
  
};
