import { useSelector, useDispatch } from "react-redux";
import { toggleSidebar, setSidebarOpen } from "../redux/sidebarSlice";

export const useSidebar = () => {
  const { open, animate } = useSelector((state) => state.sidebar);
  const dispatch = useDispatch();

  return {
    open,
    animate,
    toggleSidebar: () => dispatch(toggleSidebar()),
    setOpen: (value) => dispatch(setSidebarOpen(value)),
  };
};
