import React, { useEffect } from 'react'
import { OpenAI } from "langchain/llms/openai";
import { PromptTemplate } from "langchain/prompts";
import { LLMChain, SequentialChain, SimpleSequentialChain } from "langchain/chains";
import {} from 'langchain/agents';
// "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"

function LangchainTut() {
    const llm = new OpenAI({
        openAIApiKey: "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",
        temperature: 0.3
    });


    useEffect(() => {
        (async () => {
            //////// Simple llm //////
            // const res = await llm.predict('What is the capital of India?')
            // console.log('---llm---',res);



            //////// PromptTemplate //////
            const prompt = PromptTemplate.fromTemplate(
                "What is a the capital of {product}?"
            );
            const chain = new LLMChain({ llm, prompt });
            // const resA2 = await chainA.run("USA");
            // console.log({ resA2 });



            //////// SimpleSequentialChain //////
            const promptA = PromptTemplate.fromTemplate(
                "What is a good name of the ecommecre store that sells {product}?"
            );
            const chainA = new LLMChain({ llm, prompt: promptA });

            const promptB = PromptTemplate.fromTemplate(
                "wtah are the name of the products at {store}?"
            );
            const chainB = new LLMChain({ llm, prompt: promptB });

            const overallChain = new SimpleSequentialChain({
                chains: [chainA, chainB],
                verbose: true,
            });

            // const review = await overallChain.run("oyster mushroom");
            // console.log(review);



            //////// SequentialChain //////
            const template = `You are a playwright. Given the title of play and the era it is set in, it is your job to write a synopsis for that title.

                    Title: {title}
                    Era: {era}
                    Playwright: This is a synopsis for the above play:`;
            const promptTemplate = new PromptTemplate({
                template,
                inputVariables: ["title", "era"],
            });
            const synopsisChain = new LLMChain({
                llm,
                prompt: promptTemplate,
                outputKey: "synopsis",
            });

            const reviewTemplate = `You are a play critic from the New York Times. Given the synopsis of play, it is your job to write a review for that play.
  
                    Play Synopsis:
                    {synopsis}
                    Review from a New York Times play critic of the above play:`;
            const reviewPromptTemplate = new PromptTemplate({
                template: reviewTemplate,
                inputVariables: ["synopsis"],
            });
            const reviewChain = new LLMChain({
                llm,
                prompt: reviewPromptTemplate,
                outputKey: "review",
            });

            const overallChain2 = new SequentialChain({
                chains: [synopsisChain, reviewChain],
                inputVariables: ["era", "title"],
                // Here we return multiple variables
                outputVariables: ["synopsis", "review"],
                verbose: true,
            });
            // const chainExecutionResult = await overallChain2.call({
            //     title: "Tragedy at sunset on the beach",
            //     era: "Victorian England",
            // });
            // console.log(chainExecutionResult);
        })()


    },)

    return (
        <div>LangchainTut</div>
    )
}

export default LangchainTut