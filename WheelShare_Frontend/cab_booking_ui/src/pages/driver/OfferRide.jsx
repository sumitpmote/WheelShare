import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Navigation, Loader } from "lucide-react";
import { useToast } from "../../contexts/ToastContext";
import MapplsMap from "../../components/MapplsMap";

function OfferRide() {
  const navigate = useNavigate();
  const { error: showError, success } = useToast();
  const [formData, setFormData] = useState({
    pickupLocation: "",
    dropLocation: "",
    departureTime: "",
    estimatedFare: ""
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.pickupLocation || !formData.dropLocation || !formData.departureTime) {
      showError("Please fill all required fields");
      return;
    }

    setLoading(true);
    try {
      success("Ride offer posted successfully!");
      setTimeout(() => {
        navigate("/driver/dashboard");
      }, 1500);
    } catch (err) {
      showError(err.response?.data?.message || "Failed to post ride offer");
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 style={{ marginBottom: '2rem' }}>Offer a Ride</h2>

        <form onSubmit={handleSubmit}>
          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            {/* Form Section */}
            <div>
              <div className="card" style={{ padding: '2rem' }}>
                <div className="flex flex-col gap-md">
                  {/* Pickup Location */}
                  <div>
                    <label htmlFor="pickupLocation" style={{ fontWeight: 600, marginBottom: '0.5rem', display: 'block' }}>
                      Pickup Location*
                    </label>
                    <div style={{ position: 'relative' }}>
                      <MapPin size={18} style={{ position: 'absolute', top: '12px', left: '12px', color: 'var(--text-light)' }} />
                      <input
                        id="pickupLocation"
                        type="text"
                        name="pickupLocation"
                        placeholder="Enter pickup location"
                        className="input-field"
                        style={{ paddingLeft: '2.5rem' }}
                        value={formData.pickupLocation}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  {/* Drop Location */}
                  <div>
                    <label htmlFor="dropLocation" style={{ fontWeight: 600, marginBottom: '0.5rem', display: 'block' }}>
                      Drop Location*
                    </label>
                    <div style={{ position: 'relative' }}>
                      <Navigation size={18} style={{ position: 'absolute', top: '12px', left: '12px', color: 'var(--text-light)' }} />
                      <input
                        id="dropLocation"
                        type="text"
                        name="dropLocation"
                        placeholder="Enter drop location"
                        className="input-field"
                        style={{ paddingLeft: '2.5rem' }}
                        value={formData.dropLocation}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  {/* Departure Time */}
                  <div>
                    <label htmlFor="departureTime" style={{ fontWeight: 600, marginBottom: '0.5rem', display: 'block' }}>
                      Departure Time*
                    </label>
                    <input
                      id="departureTime"
                      type="datetime-local"
                      name="departureTime"
                      className="input-field"
                      value={formData.departureTime}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* Estimated Fare */}
                  <div>
                    <label htmlFor="estimatedFare" style={{ fontWeight: 600, marginBottom: '0.5rem', display: 'block' }}>
                      Estimated Fare (₹)
                    </label>
                    <input
                      id="estimatedFare"
                      type="number"
                      name="estimatedFare"
                      placeholder="0"
                      className="input-field"
                      value={formData.estimatedFare}
                      onChange={handleChange}
                      min="0"
                      step="10"
                    />
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
                        Posting...
                      </>
                    ) : (
                      'Post Ride Offer'
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate("/driver/dashboard")}
                    className="btn btn-ghost"
                    style={{ width: '100%' }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>

            {/* Map Section */}
            <div>
              <div className="card" style={{ overflow: 'hidden' }}>
                <MapplsMap
                  center={[28.6139, 77.209]}
                  zoom={13}
                  height={400}
                  markers={[]}
                  routeStyle={{ color: '#ef4444', weight: 4, opacity: 0.8 }}
                  showRoute={true}
                />
              </div>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default OfferRide;

