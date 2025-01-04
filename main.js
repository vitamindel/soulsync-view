import { GoogleGenerativeAI } from "@google/generative-ai";
const API_KEY = "AIzaSyBmNWi7sA_wpMP0LeG2QgSjUBQb-m69u4g";
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
});

let messages = {
    history: [],
};

async function sendMessage(event) {
    event.preventDefault(); 

    const userMessage = document.querySelector("#userInput").value.trim();
    const responseContainer = document.querySelector("#aiResponse");

    if (userMessage.length) {
        try {
            document.querySelector("#userInput").value = "";
            responseContainer.insertAdjacentHTML("beforeend", `
                <div class="user">
                    <p>${userMessage}</p>
                </div>
            `);

            const chat = model.startChat(messages);
            const result = await chat.sendMessage(userMessage);

            responseContainer.insertAdjacentHTML("beforeend", `
                <div class="model">
                    <p>${result.response.text()}</p>
                </div>
            `);

            messages.history.push({
                role: "user",
                parts: [{ text: userMessage }],
            });

            messages.history.push({
                role: "model",
                parts: [{ text: result.response.text() }],
            });
        } catch (error) {
            responseContainer.insertAdjacentHTML("beforeend", `
                <div class="error">
                    <p>The message could not be sent. Please try again.</p>
                </div>
            `);
        }

        responseContainer.scrollTop = responseContainer.scrollHeight;
    }
}

document.querySelector("#aiForm").addEventListener("submit", sendMessage);

    document.addEventListener('scroll', function () {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    let currentSectionId = '';

    sections.forEach((section) => {
        const sectionTop = section.offsetTop - 100;
        const sectionBottom = sectionTop + section.offsetHeight;

        if (
            (window.scrollY >= sectionTop && window.scrollY < sectionBottom) ||
            (window.scrollY + window.innerHeight > sectionBottom && 
             window.scrollY < sectionBottom + 100)
        ) {
            currentSectionId = section.getAttribute('id');
        }
    });

    navLinks.forEach((link) => {
        link.classList.remove('active'); 
        if (link.getAttribute('href') === `#${currentSectionId}`) {
            link.classList.add('active');
        }
    });
});


function renderResponse(rawResponse) {
    const formattedHTML = marked(rawResponse);

    const chatBubble = document.createElement('div');
    chatBubble.className = 'chat-bubble ai-response'; 
    chatBubble.innerHTML = formattedHTML; 

    document.querySelector('.chat-container').appendChild(chatBubble);
}


function handleIncomingMessage(message) {
    const isMarkdown = /\*|_|#|`|>|-/.test(message);

    const formattedHTML = isMarkdown ? marked(message) : message;

    const chatBubble = document.createElement('div');
    chatBubble.className = 'chat-bubble';
    chatBubble.innerHTML = formattedHTML;

    document.querySelector('.chat-container').appendChild(chatBubble);
}

const rawResponse = `
Here are your options:

1. **Learn about Markdown:** A lightweight markup language for formatting text.
2. **Experiment with Markdown:** Try things like \`inline code\`, *italic*, or **bold**.
3. [Markdown Guide](https://www.markdownguide.org): A comprehensive resource.
`;

handleIncomingMessage(rawResponse);

function onAIResponseReceived(responseText) {
    handleIncomingMessage(responseText); 
}

onAIResponseReceived(`Here is **bold text** and a [link](https://example.com)!`);