exports.up = function (knex) {
    return knex.schema
        .withSchema("public")
        .createTable("transactions", (table) => {
            table.uuid("id").primary();
            table
                .uuid("parking_lot_id")
                .references("id")
                .inTable("public" + ".parking_lot")
                .onDelete("cascade");

            table.string("register_number").defaultTo(0);
            table.string("color").defaultTo(0);
            table.integer("fee_amount").defaultTo(0);
            table.integer("duration_minutes").defaultTo(0);

            table
                .timestamp("checked_in", { useTz: true })
                .defaultTo(knex.fn.now());
            table.timestamp("checked_out", { useTz: true }).defaultTo(null);

            table
                .timestamp("created_at", { useTz: true })
                .defaultTo(knex.fn.now());
            table.timestamp("updated_at", { useTz: true }).defaultTo(null);
            table.timestamp("deleted_at", { useTz: true }).defaultTo(null);
        });
};

exports.down = function (knex) {
    return knex.schema.withSchema("public").dropTable("transactions");
};
