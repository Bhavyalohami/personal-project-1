import { FaCircleInfo } from "react-icons/fa6";

const EmptyState = ({
  icon,
  title = "No data yet",
  message = "Records will appear here when the system receives data.",
  action,
  compact = false,
}) => (
  <div
    className={`rounded-[1.75rem] border border-dashed border-[#67E8F9]/70 bg-[#ECFEFF]/70 text-center ${
      compact ? "p-6" : "p-10"
    }`}
  >
    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-2xl text-[#0D9488] shadow-lg shadow-teal-900/10">
      {icon || <FaCircleInfo />}
    </div>
    <h3 className="mt-4 text-xl font-black text-[#134E4A]">{title}</h3>
    <p className="mx-auto mt-2 max-w-md text-sm font-semibold leading-6 text-[#134E4A]/65">
      {message}
    </p>
    {action && <div className="mt-5">{action}</div>}
  </div>
);

export default EmptyState;
