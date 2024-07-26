
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { randomBytes, randomUUID } from "crypto";
import NextAuth from "next-auth/next";
import { NextAuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { log } from "console";
import { JWT } from "next-auth/jwt";

interface CustomUser extends User {
  roles?: string[];
}

const supabase: SupabaseClient = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function fetchUserRole(userId: number) {
  try {
    const response = await fetch(`${process.env.ASP_NET_URL}/users/${userId}`);
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
          const userData = await fetchUserRole(user.userid);
          console.log(userData);

          const customUser: CustomUser = {
            id: data.userid.toString(),
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
      };
      return updatedSession 
    }
  },
  session:{
    maxAge:1*60,
    strategy: "jwt",


    generateSessionToken: () => {
      return randomUUID?.() ?? randomBytes(32).toString("hex");
    }
    
  }
 
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
