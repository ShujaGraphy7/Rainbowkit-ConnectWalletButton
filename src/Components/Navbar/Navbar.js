import { ConnectButton } from "@rainbow-me/rainbowkit";
import "flowbite";
function Navbar() {
  return (
    <nav className="bg-white flex items-center justify-end px-2 sticky sm:px-4 overflow-hidden py-2.5 dark:bg-gray-900 w-full z-20 top-0 left-0 border-b border-gray-200 dark:border-gray-600">
      <div className=" mr-20 min-w-fit">
        <ConnectButton
          accountStatus={{
            smallScreen: "avatar",
            largeScreen: "full",
          }}
          showBalance={{
            smallScreen: false,
            largeScreen: true,
          }}
          chainStatus={"icon"}
        />
      </div>
    </nav>
  );
}

export default Navbar;
