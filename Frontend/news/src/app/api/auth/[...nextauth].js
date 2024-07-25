import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"
import { SupabaseAdapter } from "@auth/supabase-adapter"
import CredentialsProvider from "next-auth/providers/credentials"
// export const authOptions = {
//   // DUMMY PROVIDERS
//   providers: [
//     GithubProvider({
//       clientId: process.env.GITHUB_ID,
//       clientSecret: process.env.GITHUB_SECRET,
//     }),
//     // IDK HOW TO ADD CUSTOM LOGINS RN
//   ],
  
// }

export const authOptions = {
    adapter : SupabaseAdapter({
        url: process.env.SUPABASE_URL,
        secret: process.env.SUPABASE_SERVICE_ROLE_KEY,
      }),
    providers : [
        CredentialsProvider({
            name : "credentials", 
            credentials : {
                username : { label : "Username", type : "text", placeholder : "enter name"},
                password : {label : "Password", type : "password"},
            },
            async authorize(credentials) { //Callback used when logging in !

            }
        })
    ],
    session : {
        strategy : "jwt", //Allows us to track users using JSON Web Tokens !
    },
    secret : process.env.NEXTAUTH_SECRET,
}

//export default NextAuth(authOptions)