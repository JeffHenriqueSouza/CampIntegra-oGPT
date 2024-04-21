const { OpenAIClient, AzureKeyCredential } = require("@azure/openai");
const readline = require('readline');
require('dotenv').config();

const GPT_ENDPOINT = process.env.GPT_ENDPOINT;
const GPT_KEY = process.env.GPT_KEY;
const GPT_MODEL = process.env.GPT_MODEL;

const client = new OpenAIClient(GPT_ENDPOINT, new AzureKeyCredential(GPT_KEY));

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const getMessageFromAPI = async (message) => {
    try {
        const response = await client.getCompletions(
            GPT_MODEL,
            message,
            {
                temperature: 0,
                maxTokens: 50,
            }
        );
        return response.choices[0].text.trim();
    } catch (error) {
        console.error(error);
        return 'Desculpe, um erro ocorreu!';
    }
};

const askUser = (question) => {
    return new Promise((resolve) => {
        rl.question(question, (answer) => resolve(answer));
    });
};

(async () => {
    console.log('Bem vindo ao ChatBot');
    console.log('Digite "sair" a qualquer momento para sair');

    try {
        while (true) {
            const userMessage = await askUser('Você: ');

            if (userMessage.toLowerCase() === 'sair') {
                console.log('Até mais!');
                rl.close();
                break;
            }

            const botResponse = await getMessageFromAPI(userMessage);
            console.log(`Bot: ${botResponse}`);
        }
        rl.close();
    } catch (error) {
        console.error(error);
        rl.close();
    }
})();
