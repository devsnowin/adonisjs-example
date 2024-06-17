import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Cineast extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare fisrtName: string

  @column()
  declare lastName: string

  @column()
  declare headshotUrl: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
