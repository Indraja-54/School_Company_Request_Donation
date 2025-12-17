import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useLogoutMutation } from "@/redux/api/authApi";
import { logout } from "@/redux/slice/authSlice";
import { authApi } from "@/redux/api/authApi";
import { donationApi } from "@/redux/api/donationApi";
import { requestApi } from "@/redux/api/requestApi";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { partyName, userType } = useSelector(state => state.auth);
  const [logoutApi] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logoutApi().unwrap();
    } catch (err) {
      console.error(err);
    } finally {
      dispatch(logout());
      dispatch(authApi.util.resetApiState());
      dispatch(donationApi.util.resetApiState());
      dispatch(requestApi.util.resetApiState());
      navigate("/login", { replace: true });
    }
  };

  return (
    <div className="w-full bg-gray-800 text-white px-6 py-3">
      <div className="flex items-center justify-between">
        {/* LEFT */}
        <div className="text-lg font-semibold">
          {partyName}{" "}
          <span className="text-sm opacity-70">({userType})</span>
        </div>

        {/* RIGHT */}
        <Button
          variant="destructive"
          size="sm"
          onClick={handleLogout}
        >
          Logout
        </Button>
      </div>
    </div>
  );
};

export default Navbar;
