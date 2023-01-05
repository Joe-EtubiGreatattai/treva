
// import { Configuration, OpenAIApi } from 'openai';


// const configuration = new Configuration({
//   apiKey: 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,
// });

// const openai = new OpenAIApi(configuration);


const form = document.querySelector('form');
const chatContainer = document.querySelector('#chat_container');

let loadInterval;

function loader(element) {
    element.textContent = '';

    loadInterval = setInterval(() => {
        // Update the text content of the loading indicator
        element.textContent += '.';

        // If the loading indicator has reached three dots, reset it
        if (element.textContent === '....') {
            element.textContent = '';
        }
    }, 300);
}

function typeText(element, text) {
    let index = 0;

    let interval = setInterval(() => {
        if (index < text.length) {
            element.innerHTML += text.charAt(index);
            index++;
        } else {
            clearInterval(interval);
        }
    }, 20);
}

// generate unique ID for each message div of bot
// necessary for typing text effect for that specific reply
// without unique ID, typing text will work on every element
function generateUniqueId() {
    const timestamp = Date.now();
    const randomNumber = Math.random();
    const hexadecimalString = randomNumber.toString(16);

    return `id-${timestamp}-${hexadecimalString}`;
}

function chatStripe(isAi, value, uniqueId) {
    return (
        `
        <div class="wrapper ${isAi ? 'ai' : 'user'}">
            <div class="chat">
                <div class="message" id=${uniqueId}>${value}</div>
                </div>
            </div>
        `
        );
    }
    
    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const data = new FormData(form);
    
        // user's chatstripe
        chatContainer.innerHTML += chatStripe(false, data.get('prompt'));
    
        // to clear the textarea input 
        form.reset();
    
        // bot's chatstripe
        const uniqueId = generateUniqueId();
        chatContainer.innerHTML += chatStripe(true, ' ', uniqueId);
    
        // to focus scroll to the bottom 
        chatContainer.scrollTop = chatContainer.scrollHeight;
    
        // specific message div 
        const messageDiv = document.getElementById(uniqueId);
    
        // messageDiv.innerHTML = "..."
        loader(messageDiv);
        
        try {
            // const response = await fetch('http://localhost:5000', {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json',
            //     },
            //     body: JSON.stringify({
            //         prompt: data.get('prompt'),
            //     }),
            // });
            
              
            var url = "https://api.openai.com/v1/completions";

            var xhr = new XMLHttpRequest();
            xhr.open("POST", url);
            
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.setRequestHeader("Authorization", "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");
            
            xhr.onreadystatechange = function () {
               if (xhr.readyState === 4) {
                  console.log(xhr.status);
                  console.log(xhr.responseText);
                  clearInterval(loadInterval);
                  messageDiv.innerHTML = '...';
      
                //   const data = await response.json();
                //   const parsedData = data.bot.trim(); 
                // trims any trailing spaces/'\n' 
      
                //   typeText(messageDiv, parsedData);
                  messageDiv.innerHTML = xhr.responseText;
               }else{
                var response=xhr.status;
               }};
            
           
            
              var senddata = `{
                "model": "text-davinci-003",
                "prompt": "ok bro",
                "temperature": 0,
                "max_tokens": 3000,
                "top_p": 1,
                "frequency_penalty": 0.5,
                "presence_penalty": 0
              }`;
            
           xhr.send(senddata);
          
            // xhr.status(200).send({
            //     bot: response.data.choices[0].text,
            //   });

            //   console.log(response);

            // if (response.ok) {
                clearInterval(loadInterval);
                messageDiv.innerHTML = ' ';
    
                const data = await response.json();
                const parsedData = data.bot.trim(); // trims any trailing spaces/'\n' 
    
                typeText(messageDiv, parsedData);
            // } else {
            //     throw new Error(response.statusText);
            // }
        } catch (error) {
            clearInterval(loadInterval);
            messageDiv.innerHTML = open_ai_response;
            alert(error.message);
        }
    };
    
    form.addEventListener('submit', handleSubmit);
    form.addEventListener('keyup', (e) => {
        if (e.keyCode === 13) {
            handleSubmit(e);
    }
});

