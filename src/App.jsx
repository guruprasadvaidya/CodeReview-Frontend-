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
  const [code, setCode] = useState(""); // ✅ Starts with an empty editor
  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(null); // Error state
  const [copyMessage, setCopyMessage] = useState(""); // ✅ Temporary copy notification

  // ✅ Fallback backend URL in case .env is missing
  const backendUrl = "https://codereview-backend-1wbh.onrender.com";

  useEffect(() => {
    Prism.highlightAll();
  }, [code]); // ✅ Ensures syntax highlighting updates

  async function reviewCode() {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${backendUrl}/ai/get-review`, { code });

      if (response.data.review) {
        setReview(response.data.review);
      } else {
        setReview("⚠️ No review received from AI.");
      }
    } catch (error) {
      console.error("❌ Error fetching review:", error.response?.data || error.message);
      setError("⚠️ Failed to fetch review. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // ✅ Remove code from the editor
  function removeCode() {
    setCode(""); // Clears the editor
  }

  // ✅ Copy Reviewed Code (with temporary notification)
  function copyReviewedCode() {
    navigator.clipboard.writeText(review || ""); // ✅ Copies the text even if empty
    setCopyMessage("✅ Review copied!");
    setTimeout(() => setCopyMessage(""), 2000); // ✅ Auto-hide after 2s
  }

  return (
    <main>
      <div className="left">
        <div className="code-editor">
          <Editor
            value={code}
            onValueChange={setCode}
            highlight={(code) => Prism.highlight(code, Prism.languages.javascript, "javascript")}
            padding={10}
            style={{
              fontSize: 15,
              minHeight: "100%",  // ✅ Fills the full height of the left container
              width: "100%",
              fontFamily: "Fira Code, Fira Mono",
              background: "transparent",
              border: "none",
              outline: "none",
              overflow: "auto",
            }}
          />
          {!code && (
            <p className="placeholder">💡 Put your code here to debug...</p>
          )}
        </div>

        {/* ✅ Buttons aligned properly */}
        <div className="button-container">
          <button className="review" onClick={reviewCode} disabled={loading}>
            {loading ? "Reviewing..." : "Review Code"}
          </button>
          <button className="remove" onClick={removeCode}>Remove</button>
        </div>
      </div>

      <div className="right">
        {error && <p className="error">{error}</p>}
        <div className="review-box">
          <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
            {review || "🔍 Your AI review will appear here..."}
          </ReactMarkdown>
        </div>

        {/* ✅ Copy Code Button (Now Properly Positioned) */}
        <button className="copy-code" onClick={copyReviewedCode}>Copy Code</button>

        {/* ✅ Temporary Copy Message */}
        {copyMessage && <p className="copy-message">{copyMessage}</p>}
      </div>
    </main>
  );
}

export default App;
