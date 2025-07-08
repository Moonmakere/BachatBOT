import { FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-500  px-6 py-10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-8">
        <div>
          <h2 className="text-3xl montserrat-font-medium mb-2">Logo</h2>
          <p className="text-black mt-1 montserrat-font-medium">© 2025 DataShield Solutions Inc.</p>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-3 text-gray-900"
            aria-label="LinkedIn"
          >
            <FaLinkedin size={24} />
          </a>
        </div>

        {/* Footer Links */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 montserrat-font-medium">
          {/* Legal */}
          <div className="">
            <h3 className=" mb-2 text-gray-900">Legal</h3>
            <ul className="text-gray-800 space-y-1">
              <li>
                <a href="/terms" className="">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="/privacy" className="">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="/refund" className="">
                  Refund Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-medium mb-2 text-gray-900">Product</h3>
            <ul className="text-gray-800 space-y-1">
              <li>
                <a href="/features" className="">
                  Features
                </a>
              </li>
              <li>
                <a href="/pricing" className="">
                  Pricing
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-medium mb-2 text-gray-900">Support</h3>
            <ul className="text-gray-800 space-y-1">
              <li>
                <a href="/help" className="">
                  Help Center
                </a>
              </li>
              <li>
                <a href="/contact" className="">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
