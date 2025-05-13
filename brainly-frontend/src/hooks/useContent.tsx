import { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../config";

export function useContent(filter: string, refresh?: boolean) {
  const [contents, setContents] = useState([]);

  useEffect(() => {
    async function fetchContent() {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/v1/content`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setContents(response.data.content);
      } catch (error) {
        console.error("Error fetching content:", error);
      }
    }

    fetchContent();
  }, [filter, refresh]); // 🔁 re-fetch on filter or refresh change

  return [contents, setContents] as const; 
}
