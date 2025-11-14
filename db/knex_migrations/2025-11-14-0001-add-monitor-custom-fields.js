exports.up = function (knex) {
    return knex.schema
        .alterTable("monitor", function (table) {
            table.text("custom_fields").nullable();
        });
};

exports.down = function (knex) {
    return knex.schema
        .alterTable("monitor", function (table) {
            table.dropColumn("custom_fields");
        });
};
