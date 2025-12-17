import { ITEM_OPTIONS } from "@/constants/items";

const ItemSelect = ({ value, onChange }) => {
  const isOther = value && !ITEM_OPTIONS.includes(value);

  return (
    <div>
      <label className="block mb-1 font-medium">Item</label>

      <select
        className="border p-2 w-full rounded"
        value={ITEM_OPTIONS.includes(value) ? value : "Other"}
        onChange={(e) => {
          if (e.target.value === "Other") {
            onChange(""); // reset to custom
          } else {
            onChange(e.target.value);
          }
        }}
      >
        <option value="">Select Item</option>

        {ITEM_OPTIONS.map(item => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}

        <option value="Other">Other</option>
      </select>

      {/* Custom Item Input */}
      {isOther && (
        <input
          type="text"
          placeholder="Enter item name"
          className="border p-2 w-full mt-2 rounded"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </div>
  );
};

export default ItemSelect;
