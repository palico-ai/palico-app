import * as nodemon from 'nodemon'
import { CurrentProject } from '../../../utils'
import * as path from 'path'

export const ServeDevServer = async (): Promise<void> => {
  const projectPath = await CurrentProject.getPackageDirectory()
  // Expect this to run after compiled with typescript
  nodemon({
    script: path.join(__dirname, 'server.js'),
    ext: 'ts',
    watch: [projectPath]
  })
}
