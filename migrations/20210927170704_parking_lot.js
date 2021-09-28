exports.up = function (knex) {
    // knex.raw(`DROP DATABASE IF EXISTS ${process.env.DB_NAME};`)
    //     .then(function () {
    //         return knex.raw(`CREATE DATABASE ${process.env.DB_NAME};`);
    //     })
    //     .finally(function () {
    //         console.log("Done");
    //     });
    return knex.schema
        .withSchema("public")
        .createTable("parking_lot", (table) => {
            table.uuid("id").primary();
            table.integer("slot_number").defaultTo(0);
            table.boolean("status").defaultTo(true);
            table
                .timestamp("created_at", { useTz: true })
                .defaultTo(knex.fn.now());
            table.timestamp("updated_at", { useTz: true }).defaultTo(null);
            table.timestamp("deleted_at", { useTz: true }).defaultTo(null);
        });
};

exports.down = function (knex) {
    return knex.schema.withSchema("public").dropTable("parking_lot");
};
