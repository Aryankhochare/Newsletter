import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"
export const authOptions = {
  // DUMMY PROVIDERS
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    // IDK HOW TO ADD CUSTOM LOGINS RN
  ],
}
export default NextAuth(authOptions)