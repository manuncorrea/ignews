import { query as q } from 'faunadb'

import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'

import { fauna } from '../../../services/fauna';

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    Providers.GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      scope: 'read:user'
    }),
  ],

  callbacks: {
    async signIn(user, account, profile) {
      // inserção no faunadb
      const { email } = user

      try{
        await fauna.query(
          // SE NÃO EXISTE UM USUARIO QUE TENHA ESTE EMAIL...
          q.If(
            q.Not(
              q.Exists(
                q.Match(
                  q.Index('user_by_email'),
                  q.Casefold(user.email)
                )
              )
            ),
            //... CRIE UM NOVO USUARIO COM EMAIL DIGITADO...
            q.Create(
              q.Collection('users'),
              { data: { email }}
            ),
            // ...SE NÃO BUSCA O USUARIO
            q.Get(
              q.Match(
                q.Index('user_by_email'),
                q.Casefold(user.email)
              )
            )
          )
        )
        return true
      } catch {
        return false
      }

      
    },
  }
})