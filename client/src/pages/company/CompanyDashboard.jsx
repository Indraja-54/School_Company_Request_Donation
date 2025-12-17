import { useSelector } from "react-redux";
import { useGetCompanyDonationsQuery } from "@/redux/api/donationApi";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const CompanyDashboard = () => {
  const { partyId, partyName } = useSelector(state => state.auth);

  const {
    data: donations = [],
    isLoading,
  } = useGetCompanyDonationsQuery(partyId, { skip: !partyId });

  return (
    <div className="p-10">
      {/* 🔥 HEADER: Company Name + Button */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">
          {partyName || "Company"}
        </h1>

        <Link to="/company/donations/new">
          <Button className="bg-orange-500 hover:bg-orange-600">
            + New Donation
          </Button>
        </Link>
      </div>

      {/* Donations Table */}
      <h2 className="font-semibold mb-2">Donations Contributed</h2>

      <table className="w-full border border-gray-300">
        <thead className="bg-gray-700 text-white">
          <tr>
            <th className="p-2 border">Item</th>
            <th className="p-2 border">Quantity Donated</th>
            <th className="p-2 border">Date</th>
            <th className="p-2 border">Shipping #</th>
          </tr>
        </thead>

        <tbody>
          {isLoading && (
            <tr>
              <td colSpan="4" className="text-center p-4">
                Loading...
              </td>
            </tr>
          )}

          {!isLoading && donations.length === 0 && (
            <tr>
              <td colSpan="4" className="text-center p-4">
                No Donations Yet
              </td>
            </tr>
          )}

          {donations.map((d, index) => (
            <tr key={index}>
              <td className="p-2 border">{d.itemType}</td>
              <td className="p-2 border">{d.quantity}</td>
              <td className="p-2 border">{d.donatedDate}</td>
              <td className="p-2 border">{d.shippingDate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CompanyDashboard;
