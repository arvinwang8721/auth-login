import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import connectMongo from '../../../lib/conn'
import User from '../../../model/User'
import { compare } from 'bcryptjs';

export default NextAuth({
    providers: [
        CredentialsProvider({
            name: "Credentials",
            async authorize(credentials, req) {
                connectMongo().catch(error => { error: "Connection Failed...!" })

                // check user existance
                const result = await User.findOne({ email: credentials.email })
                if (!result) {
                    throw new Error("No user Found with Email Please Sign Up...!")
                }

                // compare()
                const checkPassword = await compare(credentials.password, result.password);

                // incorrect password
                if (!checkPassword || result.email !== credentials.email) {
                    throw new Error("Username or Password doesn't match");
                }

                return result;
            }
        })
    ],
    secret: "39gmTdZC9V8mgVgqPX5G9Ulxk2gLI81lwj4vQQilqVc=",
    session: {
        strategy: 'jwt',
    }

})



