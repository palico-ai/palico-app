import * as nodemon from 'nodemon'
import { CurrentProject } from '../../../utils'
import * as path from 'path'

interface ServeDevServerOptions {
  port?: number
}

export const ServeDevServer = async (options: ServeDevServerOptions): Promise<void> => {
  const port = options.port ?? process.env.PORT ?? 8000
  const projectPath = await CurrentProject.getPackageDirectory()
  // Expect this to run after compiled with typescript
  nodemon({
    script: path.join(__dirname, 'server.js'),
    ext: 'ts',
    watch: [projectPath],
    env: {
      PORT: port.toString()
    }
  })
}
