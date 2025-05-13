import { ReactElement } from "react";

export function SidebarItem({icon, text}:{
    icon: string;
    text: ReactElement;
}){
    return <div className="cursor-pointer">
                <div className="flex text-gray-700 text-bold pl-2">
                    <div className="p-2 font-bold cursor-pointer">
                        {icon}
                    </div>
                    <div className="p-2 font-bold cursor-pointer">
                        {text}
                    </div>
                </div>
            </div>
}