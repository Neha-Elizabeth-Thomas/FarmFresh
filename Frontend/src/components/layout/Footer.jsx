import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';
import { FaCcVisa, FaCcMastercard, FaCcPaypal, FaCcStripe } from 'react-icons/fa';

const Footer = () => {
  const footerLinkClasses = "text-gray-500 hover:text-green-600 transition-colors duration-300";

  return (
    <footer className="bg-gray-100 dark:bg-gray-900 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Farm Fresh Info */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">FARM FRESH</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Delivering goodness from the farm to your home.
            </p>
            <div className="flex space-x-4">
              <a href="#" className={`${footerLinkClasses} dark:hover:text-green-400`}><FaFacebook size={20} /></a>
              <a href="#" className={`${footerLinkClasses} dark:hover:text-green-400`}><FaTwitter size={20} /></a>
              <a href="#" className={`${footerLinkClasses} dark:hover:text-green-400`}><FaInstagram size={20} /></a>
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-4">COMPANY</h4>
            <ul className="space-y-2">
              <li><a href="#" className={`${footerLinkClasses} dark:hover:text-green-400`}>About</a></li>
              <li><a href="#" className={`${footerLinkClasses} dark:hover:text-green-400`}>Features</a></li>
              <li><a href="#" className={`${footerLinkClasses} dark:hover:text-green-400`}>Works</a></li>
              <li><a href="#" className={`${footerLinkClasses} dark:hover:text-green-400`}>Career</a></li>
            </ul>
          </div>

          {/* Help Links */}
          <div>
            <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-4">HELP</h4>
            <ul className="space-y-2">
              <li><a href="#" className={`${footerLinkClasses} dark:hover:text-green-400`}>Customer Support</a></li>
              <li><a href="#" className={`${footerLinkClasses} dark:hover:text-green-400`}>Delivery Details</a></li>
              <li><a href="#" className={`${footerLinkClasses} dark:hover:text-green-400`}>Terms & Conditions</a></li>
              <li><a href="#" className={`${footerLinkClasses} dark:hover:text-green-400`}>Privacy Policy</a></li>
            </ul>
          </div>

          {/* FAQ Links */}
          <div>
            <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-4">FAQ</h4>
            <ul className="space-y-2">
              <li><a href="#" className={`${footerLinkClasses} dark:hover:text-green-400`}>Account</a></li>
              <li><a href="#" className={`${footerLinkClasses} dark:hover:text-green-400`}>Manage Deliveries</a></li>
              <li><a href="#" className={`${footerLinkClasses} dark:hover:text-green-400`}>Orders</a></li>
              <li><a href="#" className={`${footerLinkClasses} dark:hover:text-green-400`}>Payments</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 md:mb-0">
            Farm Fresh © {new Date().getFullYear()}. All Rights Reserved.
          </p>
          <div className="flex items-center space-x-4 text-gray-400 dark:text-gray-300">
            <FaCcVisa size={28} />
            <FaCcMastercard size={28} />
            <FaCcPaypal size={28} />
            <FaCcStripe size={28} />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
