import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Shield, Loader } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../../contexts/ToastContext";
import { saveDriverProfile, getDriverProfile } from "../../services/driverService";

function DriverProfile() {
  const { success, error: showError } = useToast();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [formData, setFormData] = useState({
    licenseNumber: "",
    experienceYears: "",
    vehicleModel: "",
    registrationNumber: ""
  });

  // Load existing profile data
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await getDriverProfile();
        const profile = response.data;
        setFormData({
          licenseNumber: profile.licenseNumber || "",
          experienceYears: "", // This field is not stored in backend
          vehicleModel: profile.vehicleModel || "",
          registrationNumber: profile.registrationNumber || ""
        });
      } catch (error) {
        console.log("No existing profile found");
      } finally {
        setInitialLoading(false);
      }
    };
    loadProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.licenseNumber) {
      showError("License number is required");
      return;
    }

    setLoading(true);
    try {
      await saveDriverProfile({
        licenseNumber: formData.licenseNumber,
        vehicleModel: formData.vehicleModel,
        registrationNumber: formData.registrationNumber
      });
      success("Driver profile saved successfully!");
    } catch (error) {
      console.error(error);
      showError(error.response?.data?.message || "Error while updating driver profile");
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="container" style={{ paddingTop: '2rem', textAlign: 'center' }}>
        <Loader size={40} style={{ animation: 'spin 1s linear infinite' }} />
        <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem', maxWidth: '600px' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Shield size={28} color="var(--primary)" />
          Driver Profile
        </h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
          Complete your driver profile to start offering rides
        </p>

        <form onSubmit={handleSubmit}>
          <div className="card" style={{ padding: '2rem' }}>
            <div className="flex flex-col gap-md">
              {/* License Number */}
              <div>
                <label htmlFor="licenseNumber" style={{ fontWeight: 600, marginBottom: '0.5rem', display: 'block' }}>
                  License Number*
                </label>
                <input
                  id="licenseNumber"
                  type="text"
                  name="licenseNumber"
                  placeholder="Enter your license number"
                  className="input-field"
                  value={formData.licenseNumber}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Experience Years */}
              <div>
                <label htmlFor="experienceYears" style={{ fontWeight: 600, marginBottom: '0.5rem', display: 'block' }}>
                  Years of Experience*
                </label>
                <input
                  id="experienceYears"
                  type="number"
                  name="experienceYears"
                  placeholder="0"
                  className="input-field"
                  value={formData.experienceYears}
                  onChange={handleChange}
                  min="0"
                  max="70"
                  required
                />
              </div>

              {/* Vehicle Model */}
              <div>
                <label htmlFor="vehicleModel" style={{ fontWeight: 600, marginBottom: '0.5rem', display: 'block' }}>
                  Vehicle Model
                </label>
                <input
                  id="vehicleModel"
                  type="text"
                  name="vehicleModel"
                  placeholder="e.g., Toyota Swift"
                  className="input-field"
                  value={formData.vehicleModel}
                  onChange={handleChange}
                />
              </div>

              {/* Registration Number */}
              <div>
                <label htmlFor="registrationNumber" style={{ fontWeight: 600, marginBottom: '0.5rem', display: 'block' }}>
                  Vehicle Registration Number
                </label>
                <input
                  id="registrationNumber"
                  type="text"
                  name="registrationNumber"
                  placeholder="e.g., DL-01-AB-1234"
                  className="input-field"
                  value={formData.registrationNumber}
                  onChange={handleChange}
                  pattern="^[A-Z]{2}-[0-9]{2}-[A-Z]{2}-[0-9]{4}$"
                  title="Format: XX-00-XX-0000 (e.g., DL-01-AB-1234)"
                />
              </div>

              {/* Info Message */}
              <div style={{
                background: 'rgba(59, 130, 246, 0.1)',
                border: '1px solid var(--primary)',
                borderRadius: 'var(--radius-md)',
                padding: '1rem',
                fontSize: '0.9rem',
                color: 'var(--text-main)',
                display: 'flex',
                gap: '0.5rem',
                alignItems: 'flex-start'
              }}>
                <User size={18} style={{ marginTop: '0.25rem', flexShrink: 0 }} />
                <div>Make sure all information is accurate. Your profile will be verified by our team and vehicle details will be shown to customers when you start rides.</div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary"
                style={{ width: '100%', marginTop: '1rem' }}
              >
                {loading ? (
                  <>
                    <Loader size={18} style={{ animation: 'spin 1s linear infinite' }} />
                    Saving...
                  </>
                ) : (
                  'Save Profile'
                )}
              </button>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default DriverProfile;

