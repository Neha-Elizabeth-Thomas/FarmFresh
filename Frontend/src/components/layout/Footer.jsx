import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';
import { FaCcVisa, FaCcMastercard, FaCcPaypal, FaCcStripe } from 'react-icons/fa';

const Footer = () => {
  const footerLinkClasses = "text-gray-500 hover:text-green-600 transition-colors duration-300";

  return (
    <footer className="bg-gray-100 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Farm Fresh Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">FARM FRESH</h3>
            <p className="text-gray-500 mb-4">
              Delivering goodness from the farm to your home.
            </p>
            <div className="flex space-x-4">
              <a href="#" className={footerLinkClasses}><FaFacebook size={20} /></a>
              <a href="#" className={footerLinkClasses}><FaTwitter size={20} /></a>
              <a href="#" className={footerLinkClasses}><FaInstagram size={20} /></a>
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-4">COMPANY</h4>
            <ul className="space-y-2">
              <li><a href="#" className={footerLinkClasses}>About</a></li>
              <li><a href="#" className={footerLinkClasses}>Features</a></li>
              <li><a href="#" className={footerLinkClasses}>Works</a></li>
              <li><a href="#" className={footerLinkClasses}>Career</a></li>
            </ul>
          </div>

          {/* Help Links */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-4">HELP</h4>
            <ul className="space-y-2">
              <li><a href="#" className={footerLinkClasses}>Customer Support</a></li>
              <li><a href="#" className={footerLinkClasses}>Delivery Details</a></li>
              <li><a href="#" className={footerLinkClasses}>Terms & Conditions</a></li>
              <li><a href="#" className={footerLinkClasses}>Privacy Policy</a></li>
            </ul>
          </div>

          {/* FAQ Links */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-4">FAQ</h4>
            <ul className="space-y-2">
              <li><a href="#" className={footerLinkClasses}>Account</a></li>
              <li><a href="#" className={footerLinkClasses}>Manage Deliveries</a></li>
              <li><a href="#" className={footerLinkClasses}>Orders</a></li>
              <li><a href="#" className={footerLinkClasses}>Payments</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm mb-4 md:mb-0">
            Farm Fresh © {new Date().getFullYear()}. All Rights Reserved.
          </p>
          <div className="flex items-center space-x-4 text-gray-400">
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
