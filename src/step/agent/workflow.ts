import { type Step, type EntryStepInput, type IRunnableStep, StepType, type EventContext } from '../types'
import { AgentExecutorStep, InputCheckerChoiceStep, PromptBuilderStep, RunnableStep } from './step'

interface WorkflowTemplateBuilderConstructor {
  initialStep: IRunnableStep<EntryStepInput, unknown>
}
export class WorkflowTemplateBuilder {
  public readonly initialStep: IRunnableStep<EntryStepInput, unknown>

  constructor (params: WorkflowTemplateBuilderConstructor) {
    this.initialStep = params.initialStep
  }

  viewGraph (): void {
    const stepLevels: Step[][] = []
    const currentStep: Step | undefined = this.initialStep
    let currentLevel: Step[] = [currentStep]
    while (currentLevel.length > 0) {
      stepLevels.push(currentLevel)
      currentLevel = []
      for (const step of stepLevels[stepLevels.length - 1]) {
        if (step.type === StepType.Choice) {
          const choiceStep = step
          for (const choice of choiceStep.choices) {
            currentLevel.push(choice)
          }
        } else if (step.type === StepType.Runnable) {
          const runnableStep = step
          if (runnableStep.nextStep) {
            currentLevel.push(runnableStep.nextStep)
          }
        }
      }
    }
    stepLevels.forEach((level, index) => {
      let levelString = `Level ${index}: `
      level.forEach((step) => {
        levelString += `${step.name}, `
      })
      console.log(levelString)
    })
  }
}

export interface IntentClassifierOutput extends EntryStepInput {
  intent: 'summarize' | 'translate'
}

class IntentClassifier extends RunnableStep<EntryStepInput, IntentClassifierOutput> {
  async run (stepInput: EntryStepInput, request: EventContext): Promise<IntentClassifierOutput> {
    throw new Error('Method not implemented.')
  }
}

class SummarizerPromptBuilder extends PromptBuilderStep {
  buildSystemPrompt (input: EntryStepInput): string {
    return 'system prompt'
  }

  buildUserPrompt (input: EntryStepInput): string {
    return 'user prompt'
  }
}

class TranslatorPromptBuilder extends PromptBuilderStep {
  buildSystemPrompt (input: EntryStepInput): string {
    return 'system prompt'
  }

  buildUserPrompt (input: EntryStepInput): string {
    return 'user prompt'
  }
}

const intentClassifier = new IntentClassifier('intentClassifier')
const summarizerPromptBuilder = new SummarizerPromptBuilder('summarizerPromptBuilder')
const translatorPromptBuilder = new TranslatorPromptBuilder('translatorPromptBuilder')
const agentExecutorStep = new AgentExecutorStep('agentExecutorStep')

const pickPromptBuilder = new InputCheckerChoiceStep<IntentClassifierOutput>('pickPromptBuilder')
pickPromptBuilder.when((input) => input.intent === 'translate', translatorPromptBuilder)
pickPromptBuilder.otherwise(summarizerPromptBuilder)

intentClassifier.setNextStep(pickPromptBuilder)

summarizerPromptBuilder.setNextStep(agentExecutorStep)
translatorPromptBuilder.setNextStep(agentExecutorStep)

const workflow = new WorkflowTemplateBuilder({
  initialStep: intentClassifier
})

workflow.viewGraph()
