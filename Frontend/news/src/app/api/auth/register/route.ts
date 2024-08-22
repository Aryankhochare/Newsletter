import axios from "axios";


export async function POST(req : Request){
    try {
        const {username, password, email} = await req.json();

        //STEP 1: validate the data received
        console.log({username,password, email});
        const response = await axios.post(`${process.env.NEXT_PUBLIC_ASP_NET_URL}/users`,{
            username,
            password,
            email,
            userRoles:[],
        })
        if (response.status===200){
            alert("User Created Successfully");
            return new Response(JSON.stringify({message:"User created successfully", userId: response.data, redirect:'/main'}),{
                status:200,
                headers:{'Content-Type':'application/json'},
            });
        }
        else{
            return new Response(JSON.stringify({message:"Failed to create user"}),{
               status:response.status,
               headers:{'Content-Type':'application/json'},
            });

        
        }
        

    } catch (error) {
        console.log(error);   
        return new Response(JSON.stringify({ message: 'Internal server error' }), {
            status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
    }
}