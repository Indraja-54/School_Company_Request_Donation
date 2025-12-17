import { useSelector } from "react-redux";
import {
  useGetPendingRequestsQuery,
  useGetProcessedRequestsQuery,
} from "@/redux/api/requestApi";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const SchoolRequestsDashboard = () => {
  const { partyId, partyName } = useSelector(state => state.auth);

  const {
    data: pending = [],
    isLoading: pendingLoading,
  } = useGetPendingRequestsQuery(partyId, { skip: !partyId });

  const {
    data: processed = [],
    isLoading: processedLoading,
  } = useGetProcessedRequestsQuery(partyId, { skip: !partyId });

  return (
    <div className="p-10">
      {/* 🔥 HEADER: School Name + Button */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">
          {partyName || "School"}
        </h1>

        <Link to="/school/requests/new">
          <Button className="bg-orange-500 hover:bg-orange-600">
            + New Request
          </Button>
        </Link>
      </div>

      {/* 🔹 Pending Requests */}
      <h2 className="font-semibold mb-2">Pending Requests</h2>

      <table className="w-full border border-gray-300">
        <thead className="bg-gray-700 text-white">
          <tr>
            <th className="p-2 border">Item</th>
            <th className="p-2 border">Quantity Requested</th>
            <th className="p-2 border">Pending</th>
            <th className="p-2 border">Status</th>
          </tr>
        </thead>

        <tbody>
          {pendingLoading && (
            <tr>
              <td colSpan="4" className="text-center p-4">
                Loading...
              </td>
            </tr>
          )}

          {!pendingLoading && pending.length === 0 && (
            <tr>
              <td colSpan="4" className="text-center p-4">
                No Pending Requests
              </td>
            </tr>
          )}

          {pending.map(req => (
            <tr key={req.id}>
              <td className="p-2 border">{req.itemType}</td>
              <td className="p-2 border">{req.quantityRequested}</td>
              <td className="p-2 border">{req.pendingQuantity}</td>
              <td className="p-2 border">{req.status}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 🔹 Processed Requests */}
      <h2 className="font-semibold mt-6 mb-2">Processed Requests</h2>

      <table className="w-full border border-gray-300">
        <thead className="bg-gray-700 text-white">
          <tr>
            <th className="p-2 border">Item</th>
            <th className="p-2 border">Company</th>
            <th className="p-2 border">Quantity</th>
          </tr>
        </thead>

        <tbody>
          {processedLoading && (
            <tr>
              <td colSpan="3" className="text-center p-4">
                Loading...
              </td>
            </tr>
          )}

          {!processedLoading && processed.length === 0 && (
            <tr>
              <td colSpan="3" className="text-center p-4">
                No Processed Requests
              </td>
            </tr>
          )}

          {processed.map(req => (
            <tr key={req.id}>
              <td className="p-2 border">{req.itemType}</td>
              <td className="p-2 border">{req.companyName}</td>
              <td className="p-2 border">{req.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SchoolRequestsDashboard;
