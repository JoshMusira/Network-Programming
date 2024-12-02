import React, { useState } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import OveralTheme from './readymade/OveralTheme';
import Achievement from './readymade/Achievement';
import IntentPersona from './readymade/IntentPersona';
import MissedOpportunity from './readymade/MissedOpportunity';
import jsPDF from 'jspdf';
import markdownIt from "markdown-it";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

pdfMake.vfs = pdfFonts.pdfMake.vfs;

const QueryDatabase = () => {
    const [question, setQuestion] = useState('');
    const [selectedDatabase, setSelectedDatabase] = useState('');
    const [answer, setAnswer] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [documents, setDocuments] = useState([]);
    const [done, setDone] = useState(false);
    const [customLoading, setCustomIsLoading] = useState(false);
    const [isLoading_stream, setIsLoading_stream] = useState(false);
    const [isComplete, setIsComplete] = useState(false);

    const handleDatabaseChange = (e) => {
        setSelectedDatabase(e.target.value);
    };

    const handleQuestionChange = (e) => {
        setQuestion(e.target.value);
    };



    const handleSubmit = async (e) => {
        if (!question || !selectedDatabase) {
            alert("Please enter a question and select a database.");
            return;
        }
        setAnswer('');
        setIsComplete(false);
        setIsLoading(true);
        setDone(false); // Reset 'done' state when starting a new query
        e.preventDefault();

        const websocket = new WebSocket('ws://127.0.0.1:8000/api/async_chat');

        websocket.onopen = () => {
            const message = JSON.stringify({ question, database: selectedDatabase });
            websocket.send(message);
        };

        websocket.onmessage = (event) => {
            console.log("Received event: ", event.data);
            const data = JSON.parse(event.data);
            if (data.event_type === 'on_retriever_end') {
                setDocuments(data.content);
            } else if (data.event_type === 'on_chat_model_stream') {
                setAnswer(prev => prev + data.content);
            } else if (data.event_type === 'Done') {
                setIsComplete(true);
                setIsLoading(false);
            }
        };

        websocket.onclose = (event) => {
            if (!isComplete) {
                setIsLoading(false);
            }
        };
    };

    const handleReadyMadeSubmit = async (buttonName) => {
        console.log('Button clicked:', buttonName);
        setAnswer('');
        setIsComplete(false);
        setIsLoading_stream(true);

        const websocket = new WebSocket('ws://127.0.0.1:8000/api/async_customed_chat');

        websocket.onopen = () => {
            const message = JSON.stringify({ prompt_type: buttonName, database: selectedDatabase });
            websocket.send(message);
        };

        websocket.onmessage = (event) => {
            console.log("Received event: ", event.data);
            const data = JSON.parse(event.data);
            if (data.event_type === 'on_retriever_end') {
                setDocuments(data.content);
            } else if (data.event_type === 'on_chat_model_stream') {
                setAnswer(prev => prev + data.content);
            } else if (data.event_type === 'Done') {
                setIsComplete(true);
                setCustomIsLoading(false);
                setIsLoading_stream(false);
            }
        };

        websocket.onclose = (event) => {
            if (!isComplete) {
                setCustomIsLoading(false);
                setIsLoading_stream(false);
            }
        };
    };
    const handleDownloadPdf = () => {
        const docDefinition = convertMarkdownToPdfContent(answer);
        pdfMake.createPdf(docDefinition).download('answer.pdf');
      };
    
      const convertMarkdownToPdfContent = (markdown) => {
        const md = markdownIt();
        const tokens = md.parse(markdown, {});
        const content = tokensToPdfContent(tokens);
    
        return {
          content: content,
          styles: {
            header: {
              fontSize: 18,
              bold: true,
              margin: [0, 0, 0, 10],
            },
            subheader: {
              fontSize: 16,
              bold: true,
              margin: [0, 10, 0, 5],
            },
            body: {
              fontSize: 12,
              lineHeight: 1.5,
            },
            bullet: {
              margin: [0, 0, 0, 5],
            },
            section: {
              margin: [0, 10, 0, 10],
            },
          },
        };
      };
    
      const tokensToPdfContent = (tokens) => {
        const content = [];
    
        tokens.forEach((token) => {
          switch (token.type) {
            case 'heading_open':
              content.push({
                text: token.content,
                style: 'header',
                margin: [0, 10, 0, 5],
              });
              break;
            case 'paragraph_open':
              content.push({
                text: token.content,
                style: 'body',
              });
              break;
            case 'list_item_open':
              content.push({
                text: token.content,
                style: 'bullet',
              });
              break;
            case 'strong_open':
              content.push({
                text: token.content,
                style: 'subheader',
              });
              break;
            default:
              if (token.content) {
                content.push({
                  text: token.content,
                  style: 'body',
                });
              }
          }
        });
    
        return content;
      };
      
    return (
        <div className=" flex items-center flex-col justify-center py-3 px-4 sm:px-6 lg:px-8">
                 <div className='fex  w-full shadow-sm shadow-white rounded-lg p-2 justify-around items-start'>
                <label className="flex  text-xl items-start font-bold text-blue-500">Select Database:</label>
                <div className="mt-1  border-b-white flex  w-full justify-around pb-2  space-y-2">
                    <div className="flex items-center">
                        <input
                            id="sports"
                            name="database"
                            type="radio"
                            value="sports"
                            onChange={handleDatabaseChange}
                            className="focus:ring-blue-600 h-4 w-4 text-blue-600 border-gray-500"
                        />
                        <label htmlFor="sports" className="ml-3 block text-sm font-semibold text-white">
                            Sports Database
                        </label>
                    </div>
                    <div className="flex items-center">
                        <input
                            id="politics"
                            name="database"
                            type="radio"
                            value="politics"
                            onChange={handleDatabaseChange}
                            className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                        />
                        <label htmlFor="politics" className="ml-3 block text-sm font-semibold text-white">
                            Political News Database
                        </label>
                    </div>
                    <div className="flex items-center">
                        <input
                            id="industry"
                            name="database"
                            type="radio"
                            value="industry"
                            onChange={handleDatabaseChange}
                            className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                        />
                        <label htmlFor="industry" className="ml-3 block text-sm font-semibold text-white">
                            Industry News Database
                        </label>
                    </div>
                </div>
                
            </div>
            <div className='flex mt-3 justify-between w-full'>
                <OveralTheme
                    handleReadyMadeSubmit={handleReadyMadeSubmit}
                    customLoading={customLoading}
                    setCustomIsLoading={setCustomIsLoading}
                />
                <Achievement
                    handleReadyMadeSubmit={handleReadyMadeSubmit}
                    customLoading={customLoading}
                    setCustomIsLoading={setCustomIsLoading}
                />
                <IntentPersona
                    handleReadyMadeSubmit={handleReadyMadeSubmit}
                    setCustomIsLoading={setCustomIsLoading}
                    customLoading={customLoading}
                />
                <MissedOpportunity
                    handleReadyMadeSubmit={handleReadyMadeSubmit}
                    customLoading={customLoading}
                    setCustomIsLoading={setCustomIsLoading}
                />
            </div>
            <h2 className='text-4xl text-gray-400 font-bold'>
                OR
            </h2>
            <div className="max-w-[95%] w-full space-y-3 p-2 bg-white rounded-xl shadow-lg z-10">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-blue-700">Query Youtube Database</h1>
                </div>
                <div className="mt-8 space-y-6">
                <div className='flex justify-between gap-9 w-full'>
                        {/* <label htmlFor="question" className="block text-sm font-bold text-black">
                            Your Question below:
                        </label> */}
                        <textarea
                            id="question"
                            name="question"
                            rows="1"
                            required
                            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            placeholder="Enter your question here"
                            value={question}
                            onChange={handleQuestionChange}
                        />
                        <button
                            onClick={handleSubmit}
                            className="group w-[150px]  relative  flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Querying...' : 'Submit'}
                        </button>
                    </div>
                </div>
            </div>
           
            {answer && (
                <div className="mt-4 p-4 border border-gray-400 w-[99%] rounded-md bg-black">
                    <h2 className="text-lg font-bold text-white">Answer</h2>
                    <ReactMarkdown className="flex justify-start text-start text-xl flex-col py-2 text-gray-400 items-start leading-7">
                        {answer}
                    </ReactMarkdown>
                </div>
            )}
              {answer && (
                <button
                    onClick={handleDownloadPdf}
                    disabled={isLoading_stream}
                    style={{ cursor: isLoading_stream ? 'not-allowed' : 'pointer' }} 
                    className="bg-blue-500 text-white font-bold w-[250px] py-2 px-4 rounded mt-4 hover:bg-blue-700"
                >
                    Download Answer as PDF
                </button>
            )}
            {isComplete && (
                <div className="mt-4 p-4 border border-gray-400 w-[99%] rounded-md bg-green-500">
                    <h2 className="text-lg font-bold text-white">Query Complete</h2>
                    <p className="text-white">Your query has been successfully processed.</p>
                </div>
            )}
        </div>
    );
};

export default QueryDatabase;
