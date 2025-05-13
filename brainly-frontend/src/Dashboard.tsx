import { Sidebar } from "./components/Sidebar";
import { CreateContentModal } from "./components/CreateContentModal";
import { PlusIcon } from "./icons/PlusIcon";
import { ShareIcon } from "./icons/ShareIcon";
import { useState } from "react";
import { Card } from "./components/Card";
import { Button } from "./components/ui/Button";
import { useContent } from "./hooks/useContent";
import { BACKEND_URL } from "./config";
import axios from "axios";

export function Dashboard() {
  const [modalOpen, setModalOpen] = useState(true);
  const [filter, setFilter] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [contents, setContents] = useContent(filter, refresh);

  const safeContents = Array.isArray(contents) ? contents : [];

  const handleDelete = (id: string) => {
    setContents((prev) => prev.filter((item: any) => item._id !== id));
  };

  const filteredContents = filter
  //@ts-ignore
    ? safeContents.filter((item) => item.type === filter)
    : safeContents;

  return (
    <div>
      <Sidebar setFilter={setFilter} />
      <div className="p-2 ml-72 min-h-screen bg-gray-100">
      <CreateContentModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={() => setRefresh(prev => !prev)} // 👈 trigger re-fetch
      />

        <div className="flex justify-between">
          <div className="text-4xl ml-8">All brain links</div>
          <div className="flex justify-end">
            <Button
              startIcon={<PlusIcon />}
              variant="primary"
              text="add content"
              onClick={() => setModalOpen(true)}
              size="md"
            />
            <Button
              startIcon={<ShareIcon />}
              variant="primary"
              text="Share"
              onClick={async () => {
                try {
                  const response = await axios.post(
                    `${BACKEND_URL}/api/v1/brain/share`,
                    { share: true },
                    {
                      headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                      },
                    }
                  );
                  const shareUrl = `http://localhost:5173/share/${response.data.hash}`;
                  alert(shareUrl);
                } catch (error) {
                  console.error("Error during axios request:", error);
                }
              }}
              size="md"
            />
          </div>
        </div>

        {filteredContents.length === 0 ? (
          <div className="ml-8 mt-4 text-gray-500">No content available.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-4 ml-4">
            {filteredContents.map(({ _id, title, link, type }) => (
              <Card
                id={_id}
                key={_id}
                title={title}
                link={link}
                type={type}
                onDelete={() => handleDelete(_id)} 
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
