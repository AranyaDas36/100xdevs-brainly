import { SidebarItem } from "./SidebarItem";
import { AcademicIcon } from "./ui/AcademicIcon";
import { TwitterIcon } from "./ui/TwitterIcon";
import { YouTubeIcon } from "./ui/YoutubeIcon";

export function Sidebar({ setFilter }) {
    return (
        <div className="h-screen w-72 bg-white border-r fixed top-0 left-0">
            <div>
                <div className="text-4xl pt-2">
                    <SidebarItem text={"Brainly"} icon={<AcademicIcon />} />
                </div>
                <div
                    className="hover:bg-amber-300 max-w-52 m-4 rounded cursor-pointer"
                    onClick={() => setFilter("youtube")}
                >
                    <SidebarItem text={"Youtube"} icon={<YouTubeIcon />} />
                </div>
                <div
                    className="hover:bg-amber-300 max-w-52 m-4 rounded cursor-pointer"
                    onClick={() => setFilter("twitter")}
                >
                    <SidebarItem text={"Twitter"} icon={<TwitterIcon />} />
                </div>
            </div>
        </div>
    );
}
