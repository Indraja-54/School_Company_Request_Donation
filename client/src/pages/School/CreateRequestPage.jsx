import { useState } from "react";
import {
  useCreateRequestMutation,
  useGetAvailableDonationsQuery,
} from "@/redux/api/requestApi";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import ItemSelect from "@/components/ItemSelect";


const CreateRequestPage = () => {
  const navigate = useNavigate();
  const { partyName } = useSelector(state => state.auth);
  console.log(partyName);

  const [itemType, setItemType] = useState("");
  const [requestedQty, setRequestedQty] = useState("");

  // companyId -> allocated qty
  const [selectedCompanies, setSelectedCompanies] = useState({});

  const [createRequest, { isLoading }] = useCreateRequestMutation();

  const { data: donations = [], isFetching } =
    useGetAvailableDonationsQuery(itemType, {
      skip: !itemType,
    });

    console.log(donations)

  // toggle checkbox
  const toggleCompany = (donationId) => {
    setSelectedCompanies(prev => {
      const copy = { ...prev };
      if (copy[donationId]) {
        delete copy[donationId];
      } else {
        copy[donationId] = 0;
      }
      return copy;
    });
  };

  // quantity change
  const updateQuantity = (donationId, value) => {
    setSelectedCompanies(prev => ({
      ...prev,
      [donationId]: Number(value),
    }));
  };

  const totalAllocated = Object.values(selectedCompanies).reduce(
    (sum, q) => sum + q,
    0
  );

  const submit = async () => {
    if (!itemType || !requestedQty) {
      alert("Select item and quantity");
      return;
    }

    if (totalAllocated > Number(requestedQty)) {
      alert("Allocated quantity exceeds requested quantity");
      return;
    }

    const allocations = Object.entries(selectedCompanies)
      .filter(([_, qty]) => qty > 0)
      .map(([donationId, qty]) => ({
        donationId,
        quantity: qty,
      }));

    try {
      await createRequest({
        itemType,
        quantityRequested: Number(requestedQty),
        allocations, // 🔥 important
      }).unwrap();

      navigate("/school/requests");
    } catch {
      alert("Failed to create request");
    }
  };

  return (
    <div className="p-10 max-w-5xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">
        {partyName || "School"} – New Request
      </h1>

      {/* FORM */}
      {/* FORM */}
<div className="grid grid-cols-2 gap-6 mb-8">
  {/* ✅ REUSABLE ITEM SELECT */}
  <div>
    <ItemSelect
      value={itemType}
      onChange={(value) => {
        setItemType(value);
        setSelectedCompanies({});
      }}
    />
  </div>

  <div>
    <label className="block mb-1">Requested Quantity</label>
    <input
      type="number"
      className="border p-2 w-full"
      value={requestedQty}
      min={1}
      onChange={e => setRequestedQty(e.target.value)}
    />
  </div>
</div>


      {/* DONATIONS TABLE */}
      {itemType && (
        <>
          <h2 className="font-semibold mb-2">
            Available Company Donations
          </h2>

          {isFetching ? (
            <p>Loading...</p>
          ) : donations.length === 0 ? (
            <p className="text-gray-500">No donations available</p>
          ) : (
            <table className="w-full border border-gray-300 mb-6">
              <thead className="bg-gray-700 text-white">
                <tr>
                  <th className="p-2 border">Select</th>
                  <th className="p-2 border">Company</th>
                  <th className="p-2 border">Available</th>
                  <th className="p-2 border">Take</th>
                </tr>
              </thead>
              <tbody>
                {donations.map(d => (
                  <tr key={d.donationId}>
                    <td className="p-2 border text-center">
                      <input
                        type="checkbox"
                        checked={d.donationId in selectedCompanies}
                        onChange={() => toggleCompany(d.donationId)}
                      />
                    </td>
                    <td className="p-2 border">{d.companyName}</td>
                    <td className="p-2 border text-center">
                      {d.availableQuantity}
                    </td>
                    <td className="p-2 border">
                      <input
                        type="number"
                        className="border p-1 w-24"
                        disabled={!(d.donationId in selectedCompanies)}
                        max={d.availableQuantity}
                        onChange={e =>
                          updateQuantity(d.donationId, e.target.value)
                        }
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <p className="font-medium">
            Total Allocated:{" "}
            <span className="text-green-600">
              {totalAllocated}
            </span>
            {" / "}
            {requestedQty || 0}
          </p>
        </>
      )}

      {/* SAVE */}
      <div className="text-right mt-6">
        <button
          onClick={submit}
          disabled={isLoading}
          className="bg-orange-500 text-white px-6 py-2 rounded"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default CreateRequestPage;
