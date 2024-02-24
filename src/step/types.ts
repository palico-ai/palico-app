import { type AgentResponse } from '.'
import { type MessageContext } from '../app'
import { type OpenAIMessage } from '../llm/openai'

export enum StepType {
  Runnable = 'runnable', // Programmatic step
  Choice = 'choice', // Step that makes a decision
  AgentExecutorStep = 'AgentExecutorStep', // Step that runs the agent
}

export interface EventContext {
  readonly conversationId?: string
  readonly userRequest?: {
    readonly query: string
    readonly context?: MessageContext
  }
  readonly toolOutputs?: Array<Record<string, unknown>> // If a frontend tool is used, this will be available
  history?: OpenAIMessage[] // If a conversation is continued, may have prefetched history
}

export interface StepSharedParams<Input, Output> {
  name: string
  run: (stepInput: Input, eventContext: EventContext) => Promise<Output>
}

export interface IRunnableStep<Input, Output>
  extends StepSharedParams<Input, Output> {
  type: StepType.Runnable
  nextStep?: Step
  setNextStep: (nextStep: Step) => void
}

export interface EntryStepInput {
  conversationId?: string
  query: string
  context: MessageContext
}

export enum AgentInputType {
  NewConversation = 'newConversation',
  ContinueConversation = 'continueConversation',
  ContinueWithToolResponse = 'continueWithToolResponse',
}

export interface AgentCallNewConversationInput {
  type: AgentInputType.NewConversation
  systemPrompt: string
  userPrompt: string
}

export interface AgentCallContinueConversationInput {
  type: AgentInputType.ContinueConversation
  conversationId: string
  userPrompt: string
  prefetchedHistory?: OpenAIMessage[]
}

export interface AgentCallContinueWithToolResultInput {
  type: AgentInputType.ContinueWithToolResponse
  conversationId: string
  toolOutputs: Array<Record<string, unknown>>
  prefetchedHistory?: OpenAIMessage[]
}

export type AgentStepInput =
  | AgentCallNewConversationInput
  | AgentCallContinueConversationInput

export interface IAgentExecutorStep
  extends StepSharedParams<AgentStepInput, AgentResponse> {
  type: StepType.AgentExecutorStep
  resumeWithToolResult: (
    input: AgentCallContinueWithToolResultInput,
    eventContext: EventContext
  ) => Promise<AgentResponse>
}

export interface ChoiceStepOutput {
  nextStep: Step
}

export interface IChoiceStep<Input>
  extends StepSharedParams<Input, ChoiceStepOutput> {
  choices: Step[]
  type: StepType.Choice
}

export type Step =
  | IRunnableStep<any, any>
  | IChoiceStep<any>
  | IAgentExecutorStep

// export interface Workflow {
//   addRunnableStep: <Input, Output>(step: IRunnableStep<Input, Output>) => Workflow
//   addChoiceStep: <Input>(step: IChoiceStep<Input>) => Workflow
// }

// There should be different types of workflows
// 1. RequestWorkflow - A workflow that is initiated by user message and handles building the prompt
// 2. Agent Executor Workflow - A sub workflow by RequestWorkflow that handles running the agent
