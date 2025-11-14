exports.up = function (knex) {
    return knex.schema
        .alterTable("monitor", function (table) {
            table.string("device_type", 50).nullable().defaultTo("Other");
        });
};

exports.down = function (knex) {
    return knex.schema
        .alterTable("monitor", function (table) {
            table.dropColumn("device_type");
        });
};
