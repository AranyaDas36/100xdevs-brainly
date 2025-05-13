import { ShareIcon } from "../icons/ShareIcon";
import { DeleteIcon } from "./ui/DeleteIcon";
import { FileIcon } from "./ui/FileIcon"
import axios from "axios";
import { BACKEND_URL } from "../config";

interface CardType {
    id: string;
    title: string;
    link: string;
    type: "twitter" | "youtube";
    onClick?: () => void;
    onDelete?: () => void; // ⬅️ Add this
  }
  
  export function Card({ id, title, link, type, onDelete }: CardType) {
  
    async function DeleteCard(contentId: string) {
      try {
        await axios.delete(`${BACKEND_URL}/api/v1/content/${contentId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });
        console.log("Deleted successfully");
        if (onDelete) onDelete(); // 🔁 Notify parent to refresh
      } catch (err) {
        console.error("Error deleting content:", err);
      }
    }
  
    return (
      <div className="m-6">
        <div className="p-6 bg-white rounded-md border-gray-200 border max-w-72">
          <div className="flex justify-between pb-3">
            <div className="flex w-1/2">
              <FileIcon />
              <div className="px-2">{title}</div>
            </div>
            <div className="flex">
              <a href={link} target="_blank" className="mx-4">
                <ShareIcon />
              </a>
              <button className="cursor-pointer mb-6" onClick={() => DeleteCard(id)}>
                <DeleteIcon />
              </button>
            </div>
          </div>
          <div>
            {type === "youtube" && (
              <iframe
                className="w-full"
                src={link.replace("watch", "embed").replace("?v=", "/")}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              ></iframe>
            )}
            {type === "twitter" && (
              <blockquote className="twitter-tweet">
                <a href={link.replace("x.com", "twitter.com")} />
              </blockquote>
            )}
          </div>
        </div>
      </div>
    );
  }
  