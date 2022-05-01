import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Saves extends BaseSchema {
  protected tableName = 'saves'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('user_id')
        .unsigned()
        .references('users.id')
        .onDelete('CASCADE')
        .notNullable()
      table
        .integer('post_id')
        .unsigned()
        .references('posts.id')
        .onDelete('CASCADE')
        .notNullable()
      table
        .integer('category_id')
        .unsigned()
        .references('categories.id')
        .onDelete('SET NULL')
        .nullable()
      table.timestamps()
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
