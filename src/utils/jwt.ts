import * as JWT from 'jsonwebtoken'

export default class JWTAuthenticator {
  static async generateAPIJWT (payload: any, secret: string): Promise<string> {
    return await new Promise((resolve, reject) => {
      JWT.sign(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        {
          ...payload
        },
        secret,
        {},
        (err, token) => {
          if (err ?? !token) {
            reject(err)
          } else {
            resolve(token)
          }
        }
      )
    })
  }

  static async decodeJWTToken<Payload> (token: string, secret: string): Promise<Payload> {
    const tokenPart = token.includes(' ') ? token.split(' ')[1] : token
    return await new Promise((resolve, reject) => {
      JWT.verify(tokenPart, secret, (err, decoded: any) => {
        if (err) {
          reject(err)
        } else {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          resolve(decoded)
        }
      })
    })
  }
}
