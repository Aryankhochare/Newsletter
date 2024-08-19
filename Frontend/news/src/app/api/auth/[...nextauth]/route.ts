
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { randomBytes, randomUUID } from "crypto";
import NextAuth from "next-auth/next";
import { NextAuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import jwt from 'jsonwebtoken'


interface CustomUser extends User {
  roles?: string[];
}

export const supabase: SupabaseClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!
);

async function fetchUserRole(userId: string) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_ASP_NET_URL}/users/${userId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
    }
    const userData = await response.json();   
    if (!userData.userRole || !Array.isArray(userData.userRole)) {
      console.warn("Roles are not properly defined in the API response, setting to empty array");
      userData.userRole = [];
    }
    return userData;
  } catch (error) {
    console.error("Error in fetchUserRole:", error);
    return { roles: [] };
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: {
          label: "Username: ",
          type: "text",
          placeholder: "Username",
        },
        password: {
          label: "Password: ",
          type: "password",
        },
      },
      async authorize(credentials) {
        if (!credentials) return null;

        console.log(credentials);
        const { data, error } = await supabase
          .from("Users")
          .select()
          .eq("username", credentials.username)
          .single();
        if (error || !data) return null;

        console.log(data);
        const user = data;

        if (credentials.password === user.password) {
          const userData = await fetchUserRole(user.user_id);
          console.log(userData);

          const customUser: CustomUser = {
            id: data.user_id.toString(),
            name: data.username,
            email: data.user_email,
            roles: userData.userRole,
          };
    
          console.log("Authorize function - Returning user:", customUser);
          return customUser;
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({token,user}){
      if(user){
        token.id = user.id;
        token.roles = (user as CustomUser).roles;

        const payload = {
          sub:user.id,
          name: user.name,
          email: user.email,
          roles: (user as CustomUser).roles
        };
        
        token.accessToken = jwt.sign(
          payload,
          process.env.JWT_SECRET!,
          {expiresIn: '1h'}
        ); 
        
      }

      return token;
    },
    async session({session,token}){
      const updatedSession = {
        ...session,
        user: {
          ...session.user,
          id: parseInt(token.id as string),
          roles: token.roles as string[] | undefined
        },
        accessToken: token.accessToken
      };
      console.log(`this is updated sessin : `)
      return updatedSession
    
    },

  },
  session:{
    maxAge:1*60*60,
    strategy: "jwt",


    generateSessionToken: () => {
      return randomUUID?.() ?? randomBytes(32).toString("hex");
    }
    
  },
  pages:{
    signIn:"/login",
  }
 
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
