// NextAuth route for API authentication (CredentialsProvider, in-memory users, JWT with role)

import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

// Example in-memory user store (replace with DB in production)
const users = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@demo.com",
    password: "adminpass", // Plaintext for demo; use bcrypt or DB in production
    role: "admin",
    restaurantId: 5,
    restaurantName: "Restaurant 1",
  },
  {
    id: "2",
    name: "Staff User",
    email: "staff@demo.com",
    password: "staffpass",
    role: "staff",
    restaurantId: 5,
    restaurantName: "Restaurant 1",
  },
];

// NextAuth handler/config
const handler = NextAuth({
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const user = users.find(
          (u) =>
            (u.email === credentials.username ||
              u.name === credentials.username) &&
            u.password === credentials.password
        );
        if (user) {
          // Strip password before returning user
          const { password, ...safeUser } = user;
          return safeUser;
        }
        return null;
      },
    }),
    // Optional example: EmailProvider usage
    // EmailProvider({
    //   server: process.env.EMAIL_SERVER,
    //   from: process.env.EMAIL_FROM,
    // }),
  ],
  callbacks: {
    // Add user role to JWT and user data to session
    async jwt({ token, user }) {
      if (user) token.role = user.role;
      if (user) token.user = user;
      if (user) token.restaurantId = user.restaurantId;
      if (user) token.restaurantName = user.restaurantName;
      return token;
    },
    // Add user role to session
    async session({ session, token }) {
      if (token?.role) session.user.role = token.role;
      if (token?.user) session.user = token.user;
      if (token?.restaurantId) session.user.restaurantId = token.restaurantId;
      if (token?.restaurantName)
        session.user.restaurantName = token.restaurantName;
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };

// Security note: In production, use a real DB & hash passwords; secrets via env.
