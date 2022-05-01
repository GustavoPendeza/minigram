import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class ForgotPasswords extends BaseSchema {
  protected tableName = 'forgot_passwords'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table
        .integer('user_id')
        .unsigned()
        .references('users.id')
        .onDelete('CASCADE')
        .notNullable()
      table.string('token').notNullable()
      table.boolean('used').notNullable()
      table.timestamps()
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
