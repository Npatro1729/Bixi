import NextAuth,{NextAuthOptions} from "next-auth"
import  CredentialsProvider  from "next-auth/providers/credentials";
import user from "@/models/userModel"
import { connect } from '@/dbConfig/config';
import { NextApiRequest, NextApiResponse } from 'next';

const authOptions: NextAuthOptions = {
    session: {
        strategy: 'jwt'
    },
    providers : [
        CredentialsProvider({
            type : 'credentials',
            credentials: {},
           async authorize(credentials,req){
                const{email,password} = credentials as {
                    email : string,
                    password : string
                }
                 // Add actual authentication logic here
                //  if (email === "qw@com" && password === "1234") {
                //     return { id: "1234", name: "qw", email: "qw@com" };
                
                //    }
                await connect();
                const User = await user.findOne({email: email})
                if(User && User.password === password){
                    return {id:"1" ,email: "email" };
                }
                // If login fails
               
               throw new Error("Invalid email or password");
               }
        })
    ],
    pages:{
        signIn:"/Login"
    }
};
export default async (req: NextApiRequest , res : NextApiResponse) => {
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*'); // Replace '*' with your actual origin
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, X-HTTP-Method-Override, Content-Type, Authorization, Accept'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

return await NextAuth(req, res,authOptions);
}