import { EyeIcon } from "@/components/Icons";

const TimelineActivity = ({ data }) => {
  return (
    <div className="mt-20">
      <h3 className="font-medium text-lg mb-3">Timeline Of Activities</h3>
      <div className="overflow-x-auto custom-shadow rounded">
        <table className="custom-shadow rounded w-[800px]">
          <thead>
            <tr className="shadow">
              <th className="p-3 text-sm font-normal text-start">Asset Name</th>
              <th className="p-3 text-sm font-normal text-start">Asset Type</th>
              <th className="p-3 text-sm font-normal text-start">View Activities</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, idx) => (
              <tr key={idx}>
                <td className="p-3 text-sm text-start">{item.title || item.name || "N/A"}</td>
                <td className="p-3 text-sm text-start">{item.itemType}</td>
                <td className="p-3 text-sm text-start">
                  <button><EyeIcon /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TimelineActivity;

