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
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(null); // Error state

  // ✅ Fallback backend URL in case .env is missing
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:10000";

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

  return (
    <main>
      <div className="left">
        <div className="code-editor">
          <Editor
            value={code}
            onValueChange={(code) => setCode(code)}
            highlight={(code) => Prism.highlight(code, Prism.languages.javascript, "javascript")}
            padding={10}
            style={{
              fontSize: 15,
              border: "1px solid #ddd",
              borderRadius: "5px",
              minHeight: "150px",
              width: "100%",
              fontFamily: "Fira Code, Fira Mono",
            }}
          />
        </div>
        <button className="review" onClick={reviewCode} disabled={loading}>
          {loading ? "Reviewing..." : "Review Code"}
        </button>
      </div>
      <div className="right">
        {error && <p className="error">{error}</p>}
        <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
          {review || "🔍 Your AI review will appear here..."}
        </ReactMarkdown>
      </div>
    </main>
  );
}

export default App;
