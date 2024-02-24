import { type AgentResponse } from '..'
import { type IRunnableStep, type AgentStepInput, type Step, StepType, type IChoiceStep, type ChoiceStepOutput, type IAgentExecutorStep, type AgentCallContinueWithToolResultInput, type EventContext, AgentInputType, type EntryStepInput } from '../types'

export abstract class RunnableStep<Input, Output> implements IRunnableStep<Input, Output> {
  readonly type = StepType.Runnable
  name: string
  nextStep?: Step | undefined

  constructor (name: string) {
    this.name = name
  }

  abstract run (stepInput: Input, request: EventContext): Promise<Output>

  setNextStep (nextStep: Step): void {
    this.nextStep = nextStep
  }
}

export abstract class PromptBuilderStep<Input = EntryStepInput> extends RunnableStep<Input, AgentStepInput> {
  abstract buildSystemPrompt (input: Input, request: EventContext): string

  abstract buildUserPrompt (input: Input, request: EventContext): string

  async run (input: Input, request: EventContext): Promise<AgentStepInput> {
    if (request.conversationId) {
      return {
        type: AgentInputType.ContinueConversation,
        conversationId: request.conversationId,
        userPrompt: this.buildUserPrompt(input, request),
        prefetchedHistory: request.history
      }
    } else {
      return {
        type: AgentInputType.NewConversation,
        systemPrompt: this.buildSystemPrompt(input, request),
        userPrompt: this.buildUserPrompt(input, request)
      }
    }
  }
}

export type WhenComparatorFN<Input> = (input: Input, request: EventContext) => boolean

export class InputCheckerChoiceStep<Input> implements IChoiceStep<Input> {
  readonly type = StepType.Choice
  name: string
  // choices and comparators are parallel arrays
  choices: Step[]
  comparatorAndChoiceArray: Array<{ comparator: WhenComparatorFN<Input>, choice: Step }>
  otherwiseStep?: Step

  constructor (name: string) {
    this.name = name
    this.choices = []
    this.comparatorAndChoiceArray = []
  }

  when (comparator: WhenComparatorFN<Input>, step: Step): void {
    this.comparatorAndChoiceArray.push({ comparator, choice: step })
    this.choices.push(step)
  }

  otherwise (step: Step): void {
    this.otherwiseStep = step
    this.choices.push(step)
  }

  async run (input: Input, request: EventContext): Promise<ChoiceStepOutput> {
    for (const { comparator, choice } of this.comparatorAndChoiceArray) {
      if (comparator(input, request)) {
        return { nextStep: choice }
      }
    }

    if (this.otherwiseStep) {
      return { nextStep: this.otherwiseStep }
    }

    throw new Error('No matching choice found')
  }
}

export class AgentExecutorStep implements IAgentExecutorStep {
  readonly type = StepType.AgentExecutorStep
  name: string

  constructor (name: string) {
    this.name = name
  }

  async run (input: AgentStepInput): Promise<AgentResponse> {
    throw new Error('Method not implemented.')
  }

  async resumeWithToolResult (input: AgentCallContinueWithToolResultInput): Promise<AgentResponse> {
    throw new Error('Method not implemented.')
  }
}
