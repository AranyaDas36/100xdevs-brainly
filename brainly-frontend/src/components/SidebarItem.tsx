import { ReactElement } from "react";

export function SidebarItem({
  icon,
  text,
}: {
  icon: ReactElement;
  text: string;
}) {
  return (
    <div className="cursor-pointer">
      <div className="flex text-gray-700 font-bold pl-2">
        <div className="p-2 cursor-pointer">{icon}</div>
        <div className="p-2 cursor-pointer">{text}</div>
      </div>
    </div>
  );
}
