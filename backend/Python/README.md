# ChatGrid API

This repository contains code for a ChatGrid API that leverages OpenAI's language model to simulate conversations with different roles, such as a teacher, interviewer, carrer counselor, poet, stand-up-comedian, English translator, and general AI.

## Installation

1. Clone the repository:

   ```
   git clone https://github.com/your_username/your_repository.git
   ```

2. Install the required dependencies:

   ```
   pip install -r requirements.txt
   ```

3. Set up OpenAI API credentials by following the [OpenAI API documentation](https://docs.openai.com/api/overview/authentication).

4. Replace the API key and CX values in the GoogleImagesSearch instantiation with your own values. You can obtain them by creating a project on the Google Cloud Platform and enabling the Custom Search API.

5. Run the application:

   ```
   uvicorn main:app --reload
   ```

   The application will be accessible at `http://localhost:4000` by default.

## Usage

- Open your web browser and go to http://localhost:4000/docs to access the Swagger UI.
- Use the /chat endpoint to have a conversation with the chatbot.
- Use the /chat_name endpoint to generate a concise title for a conversation based on a given role, user, and message.

### 1. Start a Conversation

**Endpoint:** `/chat`

**Method:** POST

**Request Body:**
```json
{
  "role": "Teacher",
  "message": "User input message",
  "file": null
}
```


- `role` (string, required): The role of the chatbot (e.g., "Teacher", "Interviewer", "Counselor", "Poet", "Comedian", "English Translator", "General AI").
- `message` (string, optional): The user's input message.
- `file` (file, optional): An uploaded file (supported formats: .txt, .docx, .pdf).

**Request Body:**

If the user's input is requesting images, the response will contain a list of image URLs. Otherwise, the response will contain the chatbot's text response.

```json
{
  "images": [
    "https://example.com/image1.jpg",
    "https://example.com/image2.jpg",
    "https://example.com/image3.jpg"
  ]
}
```
or

```json
{
  "text": "Chatbot response message"
}
```

### 2. Generate a Chat Title

**Endpoint:** `/chat_name`

**Method:** POST

**Request Body:**
```json
{
  "role": "Teacher",
  "user": "User question",
  "message": "Chatbot response message"
}
```

- `role` (string, required): The role of the chatbot (e.g., "Teacher", "Interviewer", "Counselor", "Poet", "Comedian", "English Translator", "General AI").
- `user` (string, required): The question asked by the user.
- `message` (string, required): The response of the chatbot.

**Response:**
```json
{
  "text": "Generated chat title"
}
```

## Supported Roles

The API supports the following roles:

- Teacher
- Interviewer
- Carrer Counselor
- Poet
- Stand-Up-Comedian
- English Translator
- General AI

For each role, there is a predefined conversation template and a corresponding memory buffer to store the conversation history.

## Dependencies

The following Python packages are used in this application:

- uvicorn: A fast ASGI server implementation.
- PyPDF2: A library for working with PDF files.
- spacy: A library for natural language processing.
- pydantic: A library for data validation and parsing.
- tempfile: A library for working with temporary files.
- googlesearch: A library for performing Google searches.
- langchain.memory: A memory module for langchain library.
- docx2txt: A library for extracting text from DOCX files.
- openai: OpenAI API client for language model completions.
- fastapi.middleware.cors: Middleware for enabling CORS in FastAPI.
- google_images_search: A library for performing Google Images searches.
- langchain: A library for creating language models with conversational context.
- fastapi: A modern, fast (high-performance) web framework for building APIs with Python.

## File Processing

The API can process different file formats (.txt, .docx, .pdf) and extract the text content for further conversation analysis.

## CORS Policy

The API is configured to allow cross-origin resource sharing (CORS) from all origins. The Access-Control-Allow-Origin header is set to "*" to allow requests from any domain.
