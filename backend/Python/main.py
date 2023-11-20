import os
import openai
import PyPDF2
import uvicorn
import docx2txt
import tempfile
from typing import Optional
from fastapi import FastAPI
from typing import Union, List
from pydantic import BaseModel
from typing import Union, List
from dotenv import load_dotenv
from fastapi import UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
#from google_images_search import GoogleImagesSearch

from langchain.memory import ConversationSummaryBufferMemory
from langchain import OpenAI, LLMChain, PromptTemplate

app = FastAPI()

load_dotenv()

# CORS_Policy
origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

#API_KEYS
openai.api_key = os.getenv('OPENAI_API_KEY') 
google_api_key = os.getenv('GOOGLE_API_KEY')
cx_api_key = os.getenv('CX_API_KEY')

# Chat class represents a chat message with a role and a message content. It also has an optional file attachment.
# The role attribute represents the role of the chatgrid and is a string.
# The message attribute stores the content of the message and is a string.
# The file attribute is an optional file attachment and is of type UploadFile. It has a default value of None.
class Chat(BaseModel):
   role: str
   message: str
   file: Optional[UploadFile] = File(default=None)
   
# Chatname class is a model representing a chat message with a role, user, and message content.
# The role attribute represents the role of the chatgrid and is a string.
# The user attribute represents the name of the user associated with the chat message and is a string.
# The message attribute stores the content of the message, which can be either a single string or a list of strings.
class Chatname(BaseModel):
   role: str
   user: str
   message: Union[str, List[str]]
    
def read_text_file(file):
   # Reads the content of a text file and returns the data as a string.
   data = file.read()
   return data

def read_docx_file(file):
   # Reads the content of a DOCX file and returns the extracted text as a string.
   # Converts the file object to a temporary file to process it with docx2txt library.
   with tempfile.NamedTemporaryFile(delete=False) as temp:
      temp.write(file.read())
      temp_path = temp.name
   text = docx2txt.process(temp_path)
   return text

def read_pdf_file(file):
   # Reads the content of a PDF file and returns the extracted text as a string.
   # Uses PyPDF2 library to read the file and extract text from each page.
   reader = PyPDF2.PdfReader(file)
   num_pages = len(reader.pages)
   text = ""
   for page_num in range(num_pages):
      page = reader.pages[page_num]
      text += page.extract_text()
   return text

def process_file(file):
   # Retrieves the file extension from the filename to determine the file type.
   file_extension = file.filename.split(".")[-1]

   if file_extension == "txt":
      # If the file extension is 'txt', calls the 'read_text_file' function to read the text data.
      text_data = read_text_file(file.file)
   elif file_extension == "docx":
      # If the file extension is 'docx', calls the 'read_docx_file' function to read the text data.
      text_data = read_docx_file(file.file)
   elif file_extension == "pdf":
      # If the file extension is 'pdf', calls the 'read_pdf_file' function to read the text data.
      text_data = read_pdf_file(file.file)
   else:
      # Raises a ValueError if the file format is not supported.
      raise ValueError("Unsupported file format")

   # Returns the extracted text data.
   return text_data

def analyze_request(text_data):
    # Generates a prompt for the fact-checker model based on the user's text data that user asking for image or not.
    prompt = f'''Pretend like a Fact-checker for only if user is asking for images or not and user message in format
    like he is asking pictures, photo, images or in any language and if user asking for give him images or image 
    link so give him True or False only. Is the sentence sense asking for images in any language ?
    User:{text_data}
    AI:'''
    
    # Uses OpenAI's completion API to generate a response for the prompt.
    completions = openai.Completion.create(
        engine="text-davinci-003",
        prompt=prompt,
        max_tokens=2,
        n=1,
        temperature=0.0,
    )
    
    # Extracts the generated response from the completions and converts it to lowercase.
    response = completions.choices[0].text.strip().lower()
    
    # Checks the response and returns True if it is "true", False otherwise.
    if response == "true":
        return True
    else:
        return False

template_mapping = {
   #Prompt template for "TEACHER" role
   "TEACHER": '''You are a teacher chatbot having a conversation with a student.

{TEACHER_chat_history}
User: {input}
TEACHER:''',
#Prompt template for "INTERVIEWER" role
   "INTERVIEWER": '''You are an interviewer chatbot having a conversation with a user and don't give amswer of another
   questions only you act like a interviewer

{INTERVIEWER_chat_history}
User: {input}
INTERVIEWER:''',
#Prompt template for "CAREER_COUNSELOR" role
   "CAREER_COUNSELOR": '''You are a carrer counselor chatbot counsling the user based on their problem and only give
   answer related to carrer and don't give answer of another questions.

{CAREER_COUNSELOR_chat_history}
User: {input}
CAREER_COUNSELOR:''',
#Prompt template for "POET" role
   "POET": '''You are a poet chatbot telling a poem based on user demand and only poem related questions.
{POET_chat_history}
User: {input}
POET:''',
#Prompt template for "STAND_UP_COMEDIAN" role
   "STAND_UP_COMEDIAN": '''You are a stand-up comedian chatbot telling a good joke on user demand and don't give answer 
   of different questions and only give answer of questions related to stand up comedian

{STAND_UP_COMEDIAN_chat_history}
User: {input}
STAND_UP_COMEDIAN:''',
#Prompt template for "ENGLISH_TRANSLATOR" role
   "ENGLISH_TRANSLATOR": '''You are an English translator chatbot translate a paragraph of user of any language in english 
   and only translate of any paragraph in english and don't give answer of another questions.

{ENGLISH_TRANSLATOR_chat_history}
User: {input}
ENGLISH_TRANSLATOR:''',
#Prompt template for GENERAL_AI role
   "GENERAL_AI": '''You are a chatbot having conversation with user.
   
{GENERAL_AI_chat_history}
User:{input}
GENERAL_AI:'''
}

memory_mapping = {
   #Conversation Summary Buffer memory for "TEACHER" role have model text-davinci-003 and temperature is 0 
   "TEACHER": ConversationSummaryBufferMemory(llm=OpenAI(temperature=0, model="text-davinci-003", max_tokens=400), memory_key="TEACHER_chat_history", max_token_limit=500),
   #Conversation Summary Buffer memory for "INTERVIEWER" role have model text-davinci-003 and temperature is 0.3
   "INTERVIEWER": ConversationSummaryBufferMemory(llm=OpenAI(temperature=0.3, model="text-davinci-003", max_tokens=400), memory_key="INTERVIEWER_chat_history", max_token_limit=500),
   #Conversation Summary Buffer memory for "CAREER_COUNSELOR" role have model text-davinci-003 and temperature is 0.5
   "CAREER_COUNSELOR": ConversationSummaryBufferMemory(llm=OpenAI(temperature=0.5, model="text-davinci-003", max_tokens=400), memory_key="CAREER_COUNSELOR_chat_history", max_token_limit=500),
   #Conversation Summary Buffer memory for "POET" role have model text-davinci-003 and temperature is 1
   "POET": ConversationSummaryBufferMemory(llm=OpenAI(temperature=1, model="text-davinci-003", max_tokens=400), memory_key="POET_chat_history", max_token_limit=500),
   #Conversation Summary Buffer memory for "CAREER_COUNSELOR" role have model text-davinci-003 and temperature is 1 
   "STAND_UP_COMEDIAN": ConversationSummaryBufferMemory(llm=OpenAI(temperature=1, model="text-davinci-003", max_tokens=400), memory_key="STAND_UP_COMEDIAN_chat_history", max_token_limit=500),
   #Conversation Summary Buffer memory for "ENGLISH_TRANSLATOR" role have model text-davinci-003 and temperature is 0 
   "ENGLISH_TRANSLATOR": ConversationSummaryBufferMemory(llm=OpenAI(temperature=0, model="text-davinci-003", max_tokens=400), memory_key="ENGLISH_TRANSLATOR_chat_history", max_token_limit=500),
   #Conversation Summary Buffer memory for "GENERAL_AI" role have model text-davinci-003 and temperature is 0
   "GENERAL_AI": ConversationSummaryBufferMemory(llm=OpenAI(temperature=0, model="text-davinci-003", max_tokens=400), memory_key="GENERAL_AI_chat_history", max_token_limit=500),
   
}

# The `llm_mapping` dictionary stores different LLMChain instances for different roles or entities.
llm_mapping = {
   # Create an LLMChain instance for the "TEACHER" role.
   "TEACHER": LLMChain(
       llm=OpenAI(temperature=0, model="text-davinci-003", max_tokens=400),  # Initialize the OpenAI language model with temperature 0 and model "text-davinci-003".
       prompt=PromptTemplate(input_variables=["TEACHER_chat_history", "input"], template=template_mapping["TEACHER"]),  # Define the input template for the teacher's chat history and the current input using the template from `template_mapping`.
       verbose=True,  # Set verbose mode to True for printing debug information during LLMChain execution.
       memory=memory_mapping["TEACHER"]  # Specify the memory mapping for the "TEACHER" role, which determines how the chat history is stored and managed.
   ),
   # Create an LLMChain instance for the "INTERVIEWER" role.
   "INTERVIEWER": LLMChain(
       llm=OpenAI(temperature=0.3, model="text-davinci-003", max_tokens=400), # Initialize the OpenAI language model with temperature 0.3 and model "text-davinci-003".
       prompt=PromptTemplate(input_variables=["INTERVIEWER_chat_history", "input"], template=template_mapping["INTERVIEWER"]), # Define the input template for the interviewer's chat history and the current input using the template from `template_mapping`.
       verbose=True, # Set verbose mode to True for printing debug information during LLMChain execution.
       memory=memory_mapping["INTERVIEWER"] # Specify the memory mapping for the "INTERVIEWER" role, which determines how the chat history is stored and managed.
   ),
   # Create an LLMChain instance for the "CAREER_COUNSELOR" role.
   "CAREER_COUNSELOR": LLMChain(
       llm=OpenAI(temperature=0.5, model="text-davinci-003", max_tokens=400), # Initialize the OpenAI language model with temperature 0.5 and model "text-davinci-003".
       prompt=PromptTemplate(input_variables=["CAREER_COUNSELOR_chat_history", "input"], template=template_mapping["CAREER_COUNSELOR"]), # Define the input template for the counselor's chat history and the current input using the template from `template_mapping`.
       verbose=True, # Set verbose mode to True for printing debug information during LLMChain execution.
       memory=memory_mapping["CAREER_COUNSELOR"] # Specify the memory mapping for the "CAREER_COUNSELOR" role, which determines how the chat history is stored and managed.
   ),
   # Create an LLMChain instance for the "POET" role.
   "POET": LLMChain(
       llm=OpenAI(temperature=1, model="text-davinci-003", max_tokens=400), # Initialize the OpenAI language model with temperature 1 and model "text-davinci-003".
       prompt=PromptTemplate(input_variables=["POET_chat_history", "input"], template=template_mapping["POET"]), # Define the input template for the poet's chat history and the current input using the template from `template_mapping`.
       verbose=True, # Set verbose mode to True for printing debug information during LLMChain execution.
       memory=memory_mapping["POET"] # Specify the memory mapping for the "POET" role, which determines how the chat history is stored and managed.
   ),
   # Create an LLMChain instance for the "STAND_UP_COMEDIAN" role.
   "STAND_UP_COMEDIAN": LLMChain(
       llm=OpenAI(temperature=1, model="text-davinci-003", max_tokens=400), # Initialize the OpenAI language model with temperature 1 and model "text-davinci-003".
       prompt=PromptTemplate(input_variables=["STAND_UP_COMEDIAN_chat_history", "input"], template=template_mapping["STAND_UP_COMEDIAN"]), # Define the input template for the stand up comedian's chat history and the current input using the template from `template_mapping`.
       verbose=True, # Set verbose mode to True for printing debug information during LLMChain execution.
       memory=memory_mapping["STAND_UP_COMEDIAN"] # Specify the memory mapping for the "STAND_UP_COMEDIAN" role, which determines how the chat history is stored and managed.
   ),
   # Create an LLMChain instance for the "ENGLISH_TRANSLATOR" role.
   "ENGLISH_TRANSLATOR": LLMChain(
       llm=OpenAI(temperature=0, model="text-davinci-003", max_tokens=400), # Initialize the OpenAI language model with temperature 0 and model "text-davinci-003".
       prompt=PromptTemplate(input_variables=["ENGLISH_TRANSLATOR_chat_history", "input"], template=template_mapping["ENGLISH_TRANSLATOR"]), # Define the input template for the english translator's chat history and the current input using the template from `template_mapping`.
       verbose=True, # Set verbose mode to True for printing debug information during LLMChain execution.
       memory=memory_mapping["ENGLISH_TRANSLATOR"] # Specify the memory mapping for the "ENGLISH_TRANSLATOR" role, which determines how the chat history is stored and managed.
   ),
   # Create an LLMChain instance for the "GENERAL_AI" role.
   "GENERAL_AI": LLMChain(
       llm=OpenAI(temperature=0, model="text-davinci-003", max_tokens=400), # Initialize the OpenAI language model with temperature 0 and model "text-davinci-003".
       prompt=PromptTemplate(input_variables=["GENERAL_AI_chat_history", "input"], template=template_mapping["GENERAL_AI"]), # Define the input template for the general ai's chat history and the current input using the template from `template_mapping`.
       verbose=True, # Set verbose mode to True for printing debug information during LLMChain execution.
       memory=memory_mapping["GENERAL_AI"] # Specify the memory mapping for the "GENERAL_AI" role, which determines how the chat history is stored and managed.
   )
}

#Chat_endpoint
@app.post("/chat")
async def process(res: Chat):
   # Extract the role from the request
   role = res.role
   
   if res.message and res.file:
      # If both message and file are present, concatenate the message and processed file content
      text_data = res.message + "\n" + process_file(res.file)
   elif res.message:
      # If only message is present, use the message as the text data
      text_data = res.message
   elif res.file:
      # If only file is present, process the file content
      text_data = process_file(res.file)
   else:
      # If no input is received, return an appropriate response
      return {"text": "No input received."}
   
   if analyze_request(text_data):
      # If the user request implies a need for images, perform an image search
      gis = GoogleImagesSearch(os.getenv('GOOGLE_API_KEY'), os.getenv('CX_API_KEY'))
      _search_params = {
         'q': text_data,
         'num': 2, 
         'fileType': 'jpg|png'
      }
      gis.search(search_params=_search_params)
      image_urls = [image.url for image in gis.results()]
      message=text_data
      return {"images": image_urls}
   else:
      # If the user request does not imply a need for images, generate a response using the LLMChain
      llm_chain = llm_mapping[role]
      output_text = llm_chain.predict(input=text_data).strip()  
      output_text = output_text.replace("\n\n", "")  
      return {"text": output_text}

   
#Chat_name_endpoint
@app.post("/chat_name")
async def chat(resp: Chatname):
    # Check the type of `resp.message` and set the `message` variable accordingly
    if isinstance(resp.message, str):
        message = resp.message
    elif isinstance(resp.message, list):
        message = "images"  
        
    # Generate a prompt for generating a concise title for the conversation
    prompt = f''' Based on a conversation where the chatbot acts as a {resp.role}, the user asks "{resp.user}," and the
    chatbot responds with "{message}," generate a concise title with a maximum of six words for this conversation. AI:'''
    
    # Use OpenAI's completion API to generate a title based on the prompt
    completions = openai.Completion.create(
        engine="text-davinci-003",
        prompt=prompt,
        max_tokens=15,
        n=1,
        temperature=1,
    )
    title = completions.choices[0].text.strip()  # Extract the generated title from the completions
    
    return {"title": title}
 

#Port_Change
if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=4000)