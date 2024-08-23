

import { randomBytes, randomUUID } from "crypto";
import NextAuth from "next-auth/next";
import { NextAuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import jwt from 'jsonwebtoken'
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import { apiLinks } from "@/utils/constants";
import axios from "axios";
import Categories from "@/app/(auth)/categorychoice/page";
import { supabase } from '@/lib/supabaseClient';


interface CustomUser extends User {
  roles?: string[];
}



async function fetchUserRole(userId: string) {
  try {
    const response = await fetch(`${apiLinks.user.fetch}/${userId}`);
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

async function createUser(user: CustomUser){
  try {
    const response = await fetch(apiLinks.user.fetch, {
      method:'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        Username: user.name,
        Email: user.email,
        Password: "", 
        UserRoles: [], 
        Categories: ['Sports']
      }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error creating user in .NET backend:", error);
    return null;
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

      CredentialsProvider({
        id: "register",
        name: "Register",
        credentials: {
          username: { label: "Username", type: "text" },
          password: { label: "Password", type: "password" },
          email: { label: "Email", type: "email" },
        },
        async authorize(credentials) {
          if (!credentials) return null;
  
          try {
            const response = await axios.post(`${apiLinks.user.fetch}`, {
              Username: credentials.username,
              Password: credentials.password,
              Email: credentials.email,
              UserRoles: [],
              Categories: ['Sports']
            });
  
            if (response.status === 200) {
              const userId = response.data.id;
              const userData = await fetchUserRole(userId);
              const user: CustomUser = {
                id: response.data.toString(),
                name: credentials.username,
                email: credentials.email,
                roles: userData.userRole,
              };
              return user;
            }
          } catch (error) {
            console.error("Registration error:", error);
          }
  
          return null;
        },
      }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!
    }),
  ],
  callbacks: { 
    async signIn({ user, account, profile }) {
      if (account?.provider === "google" || account?.provider === "facebook" || account?.provider === "credentials") {
        const { data: existingUser, error } = await supabase
          .from("Users")
          .select()
          .eq("user_email", user.email)
          .single();
  
        if (error || !existingUser) {
          const newUser: CustomUser = {
            id: user.id,
            name: user.name,
            email: user.email,
          };
  
          const createdUser = await createUser(newUser);
          if (!createdUser) {
            return false; 
          }
  
         
          const userData = await fetchUserRole(createdUser);
          (user as CustomUser).roles = userData.userRole;
        } else {

          const userData = await fetchUserRole(existingUser.user_id);
          (user as CustomUser).roles = userData.userRole;
        }
      }
      return true;
    },
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
      console.log(`this is updated session : `)
      return updatedSession
    
    },
    async redirect({ url, baseUrl }){
      if (url.startsWith("/")) return `${baseUrl}${url}`
      else if (new URL(url).origin === baseUrl) return url
    return baseUrl
    }

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
  },
 
};


