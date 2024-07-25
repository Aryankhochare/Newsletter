import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"
import { SupabaseAdapter } from "@auth/supabase-adapter"
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

export const {handlers, auth, signIn, signOut} = NextAuth({
    providers : [],
    adapter : SupabaseAdapter({
        url : process.env.SUPERBASE_URL,
        secret : process.env.SUPERBASE_SERVICE_ROLE_KEY,
    }),
})

//export default NextAuth(authOptions)