import {
  Sequelize,
  DataTypes,
  type Optional,
  type ModelDefined
} from 'sequelize'

export const sequelize = new Sequelize('sqlite::memory:')

export interface ConversationAttributes {
  id: number
  toolJSON: string
  historyJSON: string
  metadataJSON?: string
  createdAt: string
  updatedAt: string
}

export type ConversationCreationAttributes = Optional<
ConversationAttributes,
'id' | 'createdAt' | 'updatedAt' | 'metadataJSON'
>

export const ConversationTable: ModelDefined<
ConversationAttributes,
ConversationCreationAttributes
> = sequelize.define(
  'Conversation',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    toolJSON: {
      type: DataTypes.STRING
    },
    historyJSON: {
      type: DataTypes.STRING
    },
    metadataJSON: {
      type: DataTypes.STRING
    }
  },
  {
    timestamps: true
  }
)
