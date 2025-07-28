import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosConfig';
import { FiCheckCircle, FiLoader, FiEye, FiX } from 'react-icons/fi';

// --- New Modal Component for Seller Details ---
const SellerDetailsModal = ({ seller, isOpen, onClose, onVerify }) => {
    if (!isOpen || !seller) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-2xl relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200">
                    <FiX size={24} />
                </button>
                <h2 className="text-2xl font-bold mb-6">Seller Verification</h2>
                <div className="space-y-4 text-sm text-gray-700 dark:text-gray-300">
                    <p><strong>Contact Name:</strong> {seller.name}</p>
                    <p><strong>Contact Email:</strong> {seller.email}</p>
                    <p><strong>Contact Phone:</strong> {seller.phone}</p>
                    <hr className="my-4 dark:border-gray-600" />
                    <p><strong>Store Name:</strong> {seller.sellerProfile.storeName}</p>
                    <p><strong>Store Description:</strong> {seller.sellerProfile.storeDescription}</p>
                    <p><strong>GST Number:</strong> {seller.sellerProfile.gstNumber}</p>
                    <p><strong>Store Address:</strong> {`${seller.sellerProfile.address.house}, ${seller.sellerProfile.address.street}, ${seller.sellerProfile.address.city}`}</p>
                    <p><strong>Bank Account:</strong> {seller.sellerProfile.bankDetails?.accountNumber || 'N/A'}</p>
                    <p>
                        <strong>Government ID: </strong>
                        <a href={seller.sellerProfile.govIDProofURL} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                            View Document
                        </a>
                    </p>
                </div>
                <div className="flex justify-end mt-8">
                    {!seller.sellerProfile.isVerified && (
                        <button 
                            onClick={() => onVerify(seller._id)}
                            className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 flex items-center gap-2"
                        >
                            <FiCheckCircle /> Verify & Approve Seller
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};


const AdminManageSellersPage = () => {
    const [sellers, setSellers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSeller, setSelectedSeller] = useState(null);

    const fetchSellers = async () => {
        try {
            const { data } = await axiosInstance.get('/admin/sellers');
            setSellers(data);
        } catch (error) {
            console.error("Failed to fetch sellers", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSellers();
    }, []);

    const handleOpenModal = (seller) => {
        setSelectedSeller(seller);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setSelectedSeller(null);
        setIsModalOpen(false);
    };

    const handleVerify = async (sellerId) => {
        try {
            await axiosInstance.put(`/admin/sellers/${sellerId}/verify`);
            handleCloseModal();
            fetchSellers(); // Refresh the list after verification
        } catch (error) {
            alert('Failed to verify seller.');
        }
    };

    if (loading) return <div className="flex justify-center items-center h-full"><FiLoader className="animate-spin text-4xl text-green-500" /></div>;

    return (
        <>
            <div>
                <h1 className="text-3xl font-bold mb-6">Manage Sellers</h1>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="px-6 py-3">Store Name</th>
                                <th className="px-6 py-3">Contact</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sellers.map(seller => (
                                <tr key={seller._id} className="border-b dark:border-gray-700">
                                    <td className="px-6 py-4 font-medium">{seller.sellerProfile.storeName}</td>
                                    <td className="px-6 py-4">{seller.email}</td>
                                    <td className="px-6 py-4">
                                        {seller.sellerProfile.isVerified ? 
                                            <span className="text-green-500 flex items-center gap-1"><FiCheckCircle /> Verified</span> : 
                                            <span className="text-yellow-500">Pending Approval</span>
                                        }
                                    </td>
                                    <td className="px-6 py-4">
                                        <button onClick={() => handleOpenModal(seller)} className="font-medium text-blue-600 hover:underline flex items-center gap-1">
                                            <FiEye /> View Details
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <SellerDetailsModal 
                seller={selectedSeller}
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onVerify={handleVerify}
            />
        </>
    );
};

export default AdminManageSellersPage;
