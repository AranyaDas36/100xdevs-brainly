import { CrossIcon } from "./ui/CrossIcon";
import { Button } from "./ui/Button";
import { useRef, forwardRef, useState } from "react";
import { BACKEND_URL } from "../config";
import axios from "axios";


enum ContentType {
    Youtube = "youtube",
    Twitter = "twitter",
}

interface CreateContentModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void; // 👈 add this
}

//@ts-ignore
export function CreateContentModal({
  open,
  onClose,
  onSuccess,
}: CreateContentModalProps) 
 {
    const [type, setType] = useState(ContentType.Youtube);

    const titleRef = useRef<HTMLInputElement>(null);
    const linkRef = useRef<HTMLInputElement>(null);

    async function addContent() {
        const title = titleRef.current?.value;
        const link = linkRef.current?.value;
      
        if (!title || !link) {
          alert("Please provide both title and link");
          return;
        }
        
        try {
          await axios.post(`${BACKEND_URL}/api/v1/content`, {
            title,
            link,
            type
          }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
          });
      
          // Optionally close modal or refresh list
          onSuccess?.(); // 👈 trigger refresh if provided
          onClose?.();
        } catch (error) {
          console.error("Error adding content:", error);
          alert("Failed to add content. Please check your login or try again.");
        }
      }
      
//@ts-ignore
    return (
        <div>
            {open && (
                <div className="w-screen h-screen fixed top-0 left-0 flex justify-center items-center z-50">
                    <div className="absolute inset-0 bg-slate-500 opacity-80"></div>
                    <div className="relative z-10 bg-white p-6 rounded shadow-md w-full max-w-md">
                        <div className="flex justify-end font-bold">
                            <div onClick={onClose} className="cursor-pointer">
                                <CrossIcon />
                            </div>
                        </div>
                        <div className="space-y-4 mt-4">
    <Input ref={titleRef} placeholder="Title" />
    <Input ref={linkRef} placeholder="Link" />

    <div className="flex justify-around items-center">
        <label className="flex items-center space-x-2 cursor-pointer">
            <input
                type="radio"
                name="contentType"
                value={ContentType.Youtube}
                checked={type === ContentType.Youtube}
                onChange={() => setType(ContentType.Youtube)}
                className="accent-blue-500"
            />
            <span>YouTube</span>
        </label>
        <label className="flex items-center space-x-2 cursor-pointer">
            <input
                type="radio"
                name="contentType"
                value={ContentType.Twitter}
                checked={type === ContentType.Twitter}
                onChange={() => setType(ContentType.Twitter)}
                className="accent-blue-500"
            />
            <span>Twitter</span>
        </label>
    </div>

    <div className="flex justify-center">
        <Button variant="primary" text="Submit" onClick={addContent} size="md" />
    </div>
</div>

                    </div>
                </div>
            )}
        </div>
    );
}

// 👇 forwardRef version of Input
const Input = forwardRef<HTMLInputElement, { placeholder: string }>(
  ({ placeholder }, ref) => {
    return (
      <div>
        <input
          ref={ref}
          type="text"
          placeholder={placeholder}
          className="w-full px-4 py-2 border rounded m-2"
        />
      </div>
    );
  }
);
