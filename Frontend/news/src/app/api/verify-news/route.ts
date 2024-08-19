import { HfInference } from "@huggingface/inference";
import { NextApiRequest, NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

export async function POST(req : NextRequest){
    
    
        const {article} = await req.json() as {article : string};
        
        
        try{
            
            const prompt = generatePrompt(article);
        
        const response = await hf.textGeneration({
            model:'mistralai/Mixtral-8x7B-Instruct-v0.1',
            inputs: prompt,
            parameters:{
                max_new_tokens: 500,
                temperature: 0.7,
            }
        });
        const generatedText = response.generated_text.replace(prompt, '').trim();
        return NextResponse.json({ verification: generatedText }, { status: 200 });
        }
        catch (error) {    
            console.error('Error:', error);
            return NextResponse.json({ error: 'An error occurred while verifying the article' });   
        }
    
} 


function generatePrompt(article : string) : string {
    return `
    Please review the following news article and provide conclusions based on the criteria below. 

    Article:
    ${article}

     Begin your analysis by stating whether the article is "ACCURATE" or "NOT ACCURATE". Then, proceed with the conclusions.

    
    For each of the following parameters, provide a brief conclusion:

    1. Factual Accuracy: Is the information in the article accurate?
    2. Source Credibility: How credible are the sources (if any) mentioned in the article?
    3. Bias Detection: Is there any noticeable bias in the article?
    4. Consistency: Does the article align with other reliable sources of information?

    Conclude with an overall summary of the article's reliability.
    `;
}