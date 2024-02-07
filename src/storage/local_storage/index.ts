import { type ConversationAttributes, ConversationTable } from './database'
import { type ConversationModel, type UpdatableConversationModel, type ConversationService, type StorageService, type CreateConversationParams } from '../types'

class ConversationServiceImpl implements ConversationService {
  async create (params: CreateConversationParams): Promise<ConversationModel> {
    const response = await ConversationTable.create({
      toolJSON: JSON.stringify(params.tools),
      historyJSON: JSON.stringify(params.history)
    })
    return ConversationServiceImpl.parseItem(response.dataValues)
  }

  async findById (id: number): Promise<ConversationModel | undefined> {
    const response = await ConversationTable.findByPk(id)
    if (!response?.dataValues) {
      return undefined
    }
    return ConversationServiceImpl.parseItem(response.dataValues)
  }

  async update (conversation: Partial<UpdatableConversationModel>): Promise<void> {
    const response = await ConversationTable.update(
      {
        ...conversation,
        toolJSON: JSON.stringify(conversation.tools),
        historyJSON: JSON.stringify(conversation.history)
      },
      {
        where: {
          id: conversation.id
        }
      }
    )
    if (response[0] === 0) {
      throw new Error('Conversation not found')
    }
  }

  private static parseItem (item: ConversationAttributes): ConversationModel {
    return {
      id: item.id,
      tools: JSON.parse(item.toolJSON ?? '[]'),
      history: JSON.parse(item.historyJSON ?? '[]'),
      createdAt: item.createdAt,
      updatedAt: item.updatedAt
    }
  }
}

export class LocalStorage implements StorageService {
  conversation: ConversationService = new ConversationServiceImpl()
}
