import axios from "axios";
import { headers } from "next/headers";
import { NextRequest } from "next/server";

export async function PATCH(req : NextRequest){
    try {
        const {id} = await req.json();
        const response = await axios.patch(`${process.env.ASP_NET_URL}/reject/${id}`,{
            headers:{
                'Content-Type':'application/json'
            }
        });


    } catch (error) {
        
    }
}

