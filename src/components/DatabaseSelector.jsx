import React, { useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import OveralTheme from "./readymade/OveralTheme";
import IntentPersona from "./readymade/IntentPersona";
import MissedOpportunity from "./readymade/MissedOpportunity";
import Achievement from "./readymade/Achievement";
import markdownIt from "markdown-it";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

pdfMake.vfs = pdfFonts.pdfMake.vfs;

const DatabaseSelector = () => {
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedDatabases, setSelectedDatabases] = useState([]);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [customLoading, setCustomIsLoading] = useState(false);
  const [isLoading_stream, setIsLoading_stream] = useState(false);
  const [error, setError] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [isComplete, setIsComplete] = useState(false);
  const [clickedButton, setClickedButton] = useState(null);
  const [pdfImage, setPdfImage] = useState(null);

  const handleTypeChange = (event) => {
    const value = event.target.value;
    setSelectedTypes((prev) =>
      prev.includes(value)
        ? prev.filter((type) => type !== value)
        : [...prev, value]
    );
  };

  const handleDatabaseChange = (event) => {
    const value = event.target.value;
    setSelectedDatabases((prev) =>
      prev.includes(value)
        ? prev.filter((db) => db !== value)
        : [...prev, value]
    );
  };

  const api = axios.create({
    baseURL: "http://127.0.0.1:8000/api",
  });
  const handleReadyMadeSubmit = async (buttonName) => {
    console.log("Button clicked:", buttonName);
    setAnswer("");
    setIsComplete(false);
    setIsLoading_stream(true);

    const websocket = new WebSocket(
      "ws://127.0.0.1:8000/api/async_customed_chat"
    );

    websocket.onopen = () => {
      const message = JSON.stringify({ prompt_type: buttonName });
      websocket.send(message);
    };

    websocket.onmessage = (event) => {
      console.log("Received event: ", event.data);
      const data = JSON.parse(event.data);
      if (data.event_type === "on_retriever_end") {
        setDocuments(data.content);
      } else if (data.event_type === "on_chat_model_stream") {
        setAnswer((prev) => prev + data.content);
      } else if (data.event_type === "Done") {
        setIsComplete(true);
        setCustomIsLoading(false);
        setIsLoading(false);
      }
    };

    websocket.onclose = (event) => {
      if (!isComplete) {
        setCustomIsLoading(false);
        setIsLoading_stream(false);
      }
    };
  };

  const handleSubmit = async (e) => {
    setAnswer("");
    setIsComplete(false);
    setIsLoading_stream(true);
    e.preventDefault();

    const websocket = new WebSocket("ws://127.0.0.1:8000/api/async_chat");

    websocket.onopen = () => {
      const message = JSON.stringify({
        question,
        database: "Master_Collections",
      });
      websocket.send(message);
    };

    websocket.onmessage = (event) => {
      console.log("Received event: ", event.data);
      const data = JSON.parse(event.data);
      if (data.event_type === "on_retriever_end") {
        setDocuments(data.content);
      } else if (data.event_type === "on_chat_model_stream") {
        setAnswer((prev) => prev + data.content);
      } else if (data.event_type === "Done") {
        setIsComplete(true);
        setIsLoading(false);
      }
    };

    websocket.onclose = (event) => {
      if (!isComplete) {
        setIsLoading_stream(false);
      }
    };
  };

  const handleCreatingMasterDb = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await api.post(
        "/copy_collections",
        {
          source_collections: selectedDatabases,
          target_collection: "Master_Collections",
        },
        {
          timeout: 9000000000,
        }
      );
      alert("Response:", response.data.message);
    } catch (error) {
      console.error("Error creating master databases:", error);
      setAnswer("An error occurred while creating the multiple databases.");
      setError(error.message || "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const getDatabaseOptions = () => {
    let options = [];
    if (selectedTypes.includes("audio")) {
      options = [
        ...options,
        "Local Sports News",
        "Local Politics News",
        "Local Industry News",
      ];
    }
    if (selectedTypes.includes("video")) {
      options = [
        ...options,
        "Youtube politics News",
        "Youtube Industry News",
        "Youtube Sports News",
      ];
    }
    if (selectedTypes.includes("print")) {
      options = [
        ...options,
        "Print Sports News",
        "Print Politics News",
        "Print Industry News",
      ];
    }
    return options;
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
    <div className="flex justify-between  w-full">
      <div className="flex flex-col gap-1 shadow-sm shadow-white p-9 rounded-lg w-[30%] h-[450px] overflow-y-auto">
        <h1 className="text-2xl font-bold mb-4 text-slate-400">
          Select Database to Query
        </h1>
        <div className="flex justify-start items-start flex-col mb-4">
          <label className="mb-2 text-xl cursor-pointer">
            <input
              type="checkbox"
              name="databaseType"
              value="print"
              checked={selectedTypes.includes("print")}
              onChange={handleTypeChange}
              className="mr-2 cursor-pointer"
            />
            Print Database
          </label>
          <label className="mb-2 text-xl cursor-pointer">
            <input
              type="checkbox"
              name="databaseType"
              value="audio"
              checked={selectedTypes.includes("audio")}
              onChange={handleTypeChange}
              className="mr-2 cursor-pointer"
            />
            Audio Database
          </label>
          <label className="mb-2 text-xl cursor-pointer">
            <input
              type="checkbox"
              name="databaseType"
              value="video"
              checked={selectedTypes.includes("video")}
              onChange={handleTypeChange}
              className="mr-2 cursor-pointer"
            />
            Video Database
          </label>
        </div>
        {selectedTypes.length > 0 && (
          <div className="mb-4">
            <label className="block text-xl font-bold text-slate-400">
              Select Specific Databases:
            </label>
            <div className="mt-2 space-y-2">
              {getDatabaseOptions().map((db) => (
                <div key={db} className="flex items-center pl-12">
                  <input
                    type="checkbox"
                    id={db}
                    value={db}
                    checked={selectedDatabases.includes(db)}
                    onChange={handleDatabaseChange}
                    className="focus:ring-blue-600 h-4 w-4 text-blue-600 border-gray-500"
                  />
                  <label
                    htmlFor={db}
                    className="ml-3 block text-sm font-semibold text-gray-200"
                  >
                    {db
                      .replace("_", " ")
                      .replace(/(^|\s)\S/g, (t) => t.toUpperCase())}
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}
        <button
          onClick={handleCreatingMasterDb}
          disabled={isLoading}
          style={{ cursor: isLoading ? "not-allowed" : "pointer" }}
          className="bg-blue-500 px-5 h-[45px] text-white font-bold py-2 cursor-pointer rounded hover:bg-blue-700"
        >
          {isLoading ? "Creating..." : "Create Master DB"}
        </button>
      </div>

      <div className="flex flex-col gap-5 pt-0 mx-auto w-[60%]">
        <h2 className="text-2xl text-gray-400 font-semibold">
          Chat Multiple Databases
        </h2>
        <div className="flex justify-between ">
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
        <h2 className="text-4xl text-gray-400 font-bold">OR</h2>
        <div className="w-full flex gap-8 justify-center ">
          <div className="mb-4 w-full">
            <label className="block text-sm font-bold text-white">
              Enter Your Question:
            </label>
            <div className="flex justify-center gap-5">
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="mt-1 p-2 border border-gray-300 rounded w-full"
                placeholder="Type your question..."
              />
              <button
                onClick={handleSubmit}
                disabled={isLoading_stream}
                style={{ cursor: isLoading_stream ? "not-allowed" : "pointer" }}
                className="bg-blue-500 w-[150px] px-5 h-[45px] text-white font-bold py-2 cursor-pointer rounded hover:bg-blue-700"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
        {answer && (
          <div className="mt-4 p-4 border border-gray-400 w-full rounded-md bg-black">
            <h2 className="text-lg font-bold text-white">Answer</h2>
            <ReactMarkdown className="flex justify-start text-start flex-col py-2 text-gray-400 items-start leading-7">
              {answer}
            </ReactMarkdown>
          </div>
        )}
        {error && (
          <div className="mt-4 p-4 border border-red-400 w-full rounded-md bg-red-100">
            <h2 className="text-lg font-bold text-red-700">Error</h2>
            <p className="text-red-700">{error}</p>
          </div>
        )}
        {answer && (
          <button
            onClick={handleDownloadPdf}
            disabled={isLoading_stream}
            style={{ cursor: isLoading_stream ? "not-allowed" : "pointer" }}
            className="bg-blue-500 text-white font-bold w-[250px] py-2 px-4 rounded mt-4 hover:bg-blue-700"
          >
            Download Answer as PDF
          </button>
        )}
      </div>
    </div>
  );
};

export default DatabaseSelector;
