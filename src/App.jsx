import { useEffect, useState } from "react";
import "./App.css";
import Editor from "react-simple-code-editor";
import "prismjs/themes/prism-tomorrow.css";
import Prism from "prismjs";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github.css";
import ReviewSection from "./components/ReviewSection";

function App() {
  const [code, setCode] = useState(`function sum() { return 1 + 1; }`);
  const [review, setReview] = useState("");

  useEffect(() => {
    Prism.highlightAll();
  }, []);

  async function reviewCode() {
    try {
      const response = await axios.post(
        "http://localhost:5000/ai/get-review",
        { code }
      );

      if (response.data.review) {
        setReview(response.data.review);
      } else {
        setReview("No review received from AI.");
      }
    } catch (error) {
      console.error("Error fetching review:", error);
      setReview("⚠️ Failed to fetch review. Please try again.");
    }
  }

  return (
    <>
      <main>
        <div className="left">
          <div className="code">
            <Editor
              value={code}
              onValueChange={(code) => setCode(code)}
              highlight={(code) =>
                Prism.highlight(code, Prism.languages.javascript, "javascript")
              }
              padding={10}
              style={{
                fontSize: 15,
                border: "1px solid #ddd",
                borderRadius: "5px",
                height: "100%",
                width: "100%",
                fontFamily: "Fira Code, Fira Mono",
              }}
            />
          </div>
          <button className="review" onClick={reviewCode}>
            Review Code
          </button>
        </div>
        <div className="right">
          <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
            {review}
          </ReactMarkdown>
        </div>
      </main>
    </>
  );
}

export default App;