import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("devices");
  const [devices, setDevices] = useState([]);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deviceCurrentPage, setDeviceCurrentPage] = useState(1);
  const [errorCurrentPage, setErrorCurrentPage] = useState(1);

  const navigate = useNavigate();
  const limit = 5;

  useEffect(() => {
    const token = localStorage.getItem("jwt_token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  const fetchDevices = async (page) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("jwt_token");
      const response = await fetch(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/devices?page=${page}&limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 401) {
        localStorage.removeItem("jwt_token");
        navigate("/login");
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to fetch devices");
      }

      const data = await response.json();
      setDevices(data.devices);
    } catch (error) {
      console.error("Error fetching devices:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchErrors = async (page) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("jwt_token");
      const response = await fetch(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/errors?page=${page}&limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 401) {
        localStorage.removeItem("jwt_token");
        navigate("/login");
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to fetch error logs");
      }

      const data = await response.json();
      setErrors(data.logs);
    } catch (error) {
      console.error("Error fetching errors:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "devices") {
      fetchDevices(deviceCurrentPage);
    } else if (activeTab === "errors") {
      fetchErrors(errorCurrentPage);
    }
  }, [activeTab, deviceCurrentPage, errorCurrentPage]);

  const handleLogout = () => {
    localStorage.removeItem("jwt_token");
    navigate("/login");
  };

  const handleRefresh = () => {
    if (activeTab === "devices") {
      fetchDevices(deviceCurrentPage);
    } else if (activeTab === "errors") {
      fetchErrors(errorCurrentPage);
    }
  };

  const handleSyncDevice = async (deviceId) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("jwt_token");
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/devices/${deviceId}/sync`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 401) {
        localStorage.removeItem("jwt_token");
        navigate("/login");
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to sync device");
      }

      const data = await response.json();
      fetchDevices(deviceCurrentPage);
    } catch (error) {
      console.error("Error syncing device:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderPagination = (currentPage, setPage) => {
    return (
      <div className="flex justify-center mt-4 space-x-2">
        <button
          onClick={() => setPage(currentPage - 1)}
          disabled={currentPage === 1 || loading}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-center p-2 bg-gray-900 text-white rounded">
          {currentPage}
        </span>
        <button
          onClick={() => setPage(currentPage + 1)}
          disabled={
            (activeTab === "devices" && !devices.length) ||
            (activeTab === "errors" && !errors.length) ||
            loading
          }
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    );
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen font-inter">
      <div className="bg-[#620000] text-white py-2 px-4 flex justify-between items-center">
        <span className="font-semibold text-sm">PiSync Admin Dashboard</span>
        <div className="space-x-4">
          <button onClick={handleRefresh} title="Refresh" className="py-1 px-3">
            Refresh
          </button>
          <button onClick={handleLogout} title="Logout" className="py-1 px-3">
            Logout
          </button>
        </div>
      </div>

      <div className="flex space-x-4 mt-4 mb-6">
        <button
          onClick={() => setActiveTab("devices")}
          className={`px-4 py-2 text-sm text-black  transition-all duration-200 ${
            activeTab === "devices"
              ? "border-b-2 border-black font-semibold"
              : "hover:bg-gray-200"
          }`}
        >
          Device Management
        </button>
        <button
          onClick={() => setActiveTab("errors")}
          className={`px-4 py-2 text-sm text-black  transition-all duration-200 ${
            activeTab === "errors"
              ? " border-b-2 border-black font-semibold"
              : "hover:bg-gray-200"
          }`}
        >
          Recent Errors
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900"></div>
          <p className="ml-4 text-gray-700">Loading data...</p>
        </div>
      ) : (
        <>
          {activeTab === "devices" && (
            <div className="overflow-hidden">
              <table className="w-full text-sm text-left text-gray-700">
                <thead className="bg-gray-100 text-xs uppercase text-gray-700">
                  <tr>
                    <th scope="col" className="p-4">
                      Device ID
                    </th>
                    <th scope="col" className="p-4">
                      Last Sync Time
                    </th>
                    <th scope="col" className="p-4">
                      Sync Status
                    </th>
                    <th scope="col" className="p-4">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {devices.length > 0 ? (
                    devices.map((d) => (
                      <tr key={d._id} className="border-b hover:bg-gray-50">
                        <td className="p-4 font-medium text-gray-900 whitespace-nowrap">
                          {d.device_id}
                        </td>
                        <td className="p-4">
                          {new Date(d.last_sync_time).toLocaleString()}
                        </td>
                        <td className="p-4">
                          {/* <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            d.status === "Success" ? "bg-green-100 text-green-800" :
                            d.status === "Failed" ? "bg-red-100 text-red-800" :
                            "bg-yellow-100 text-yellow-800"
                          }`}>
                            {d.status || "N/A"}
                          </span> */}
                          {d.sync_status?.toLowerCase()}
                        </td>
                        <td className="p-4">
                          <button
                            onClick={() => handleSyncDevice(d.device_id)}
                            className="text-blue-600 hover:underline text-sm font-medium"
                          >
                            Sync Now
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="p-4 text-center text-gray-500">
                        No devices found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              {renderPagination(deviceCurrentPage, setDeviceCurrentPage)}
            </div>
          )}

          {activeTab === "errors" && (
            <div className="overflow-hidden">
              <table className="w-full text-sm text-left text-gray-700">
                <thead className="bg-gray-100 text-xs uppercase text-gray-700">
                  <tr>
                    <th scope="col" className="p-4">
                      Device ID
                    </th>
                    <th scope="col" className="p-4">
                      Error Message
                    </th>
                    <th scope="col" className="p-4">
                      Last Attempt
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {errors.length > 0 ? (
                    errors.map((e) => (
                      <tr key={e._id} className="border-b hover:bg-gray-50">
                        <td className="p-4 font-medium text-gray-900 whitespace-nowrap">
                          {e.device_id}
                        </td>
                        <td className="p-4">{e.error_message}</td>
                        <td className="p-4">
                          {new Date(e.log_time).toLocaleString()}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="p-4 text-center text-gray-500">
                        No error logs found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              {renderPagination(errorCurrentPage, setErrorCurrentPage)}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Dashboard;
