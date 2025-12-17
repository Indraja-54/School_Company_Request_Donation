import { useState } from "react";
import {
  useCreateDonationMutation,
  useGetPendingSchoolRequestsQuery,
} from "@/redux/api/donationApi";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import ItemSelect from "@/components/ItemSelect";




const NewDonationPage = () => {
  const navigate = useNavigate();
  const { partyName } = useSelector(state => state.auth);
  const [shippingDate, setShippingDate] = useState("");
  const [itemType, setItemType] = useState("");

  const [totalQuantity, setTotalQuantity] = useState("");
  const [selectedSchools, setSelectedSchools] = useState({});

  const [createDonation, { isLoading }] = useCreateDonationMutation();

  const { data: schools = [] } =
    useGetPendingSchoolRequestsQuery(itemType, {
      skip: !itemType,
    });

  // Checkbox toggle
  const toggleSchool = (requestId) => {
  setSelectedSchools(prev => {
    const copy = { ...prev };
    if (copy[requestId]) delete copy[requestId];
    else copy[requestId] = 0;
    return copy;
  });
};


  // Quantity change
  const updateQuantity = (requestId, value) => {
  setSelectedSchools(prev => ({
    ...prev,
    [requestId]: Number(value),
  }));
};


  const submit = async () => {
  const allocations = Object.entries(selectedSchools)
  .filter(([_, qty]) => qty > 0)
  .map(([requestId, qty]) => ({
    requestId,       // ✅ IMPORTANT
    quantity: qty,
  }));


  const allocatedTotal = allocations.reduce(
    (sum, a) => sum + a.quantity,
    0
  );

  if (allocatedTotal > Number(totalQuantity)) {
    alert("Allocated quantity exceeds total donation");
    return;
  }

  await createDonation({
  itemType,
  totalQuantity: Number(totalQuantity),
  allocations,
  shippingDate, // ✅ THIS WAS MISSING
}).unwrap();


  navigate("/company/dashboard");
};


  return (
    <div className="p-10 max-w-5xl mx-auto">
      {/* Company Name */}
      <h1 className="text-2xl font-semibold mb-6">
        {partyName || "Company"}
      </h1>

      {/* Form */}
      {/* Form */}
<div className="grid grid-cols-2 gap-6 mb-8">
  {/* ✅ ITEM SELECT (REUSABLE) */}
  <div>
    <ItemSelect value={itemType} onChange={setItemType} />
  </div>

  <div>
    <label className="block mb-1">Quantity</label>
    <input
      type="number"
      className="border p-2 w-full"
      value={totalQuantity}
      onChange={e => setTotalQuantity(e.target.value)}
    />
  </div>

  <div>
    <label className="block mb-1">Shipping Date</label>
    <input
      type="date"
      className="border p-2 w-full"
      value={shippingDate}
      onChange={e => setShippingDate(e.target.value)}
    />
  </div>
</div>


      {/* Schools Table */}
      <h2 className="font-semibold mb-2">
        Pick from Available Schools
      </h2>

      <table className="w-full border border-gray-300 mb-8">
        <thead className="bg-gray-700 text-white">
          <tr>
            <th className="p-2 border">Select</th>
            <th className="p-2 border">School</th>
            <th className="p-2 border">Pending Quantity</th>
            <th className="p-2 border">Allocate</th>
          </tr>
        </thead>

        <tbody>
          {schools.length === 0 && (
            <tr>
              <td colSpan="4" className="text-center p-4">
                No pending requests
              </td>
            </tr>
          )}

          {schools.map(s => (
  <tr key={s.requestId}>
    <td>
      <input
        type="checkbox"
        checked={s.requestId in selectedSchools}
        onChange={() => toggleSchool(s.requestId)}
      />
    </td>

    <td>{s.schoolName}</td>
    <td>{s.pendingQuantity}</td>

    <td>
      <input
        type="number"
        disabled={!(s.requestId in selectedSchools)}
        max={s.pendingQuantity}
        onChange={e =>
          updateQuantity(s.requestId, e.target.value)
        }
      />
    </td>
  </tr>
))}

        </tbody>
      </table>

      {/* Save Button */}
      <div className="text-right">
        <button
          disabled={isLoading}
          onClick={submit}
          className="bg-orange-500 text-white px-6 py-2 rounded"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default NewDonationPage;
