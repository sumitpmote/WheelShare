import { useState } from 'react';
import { Upload, FileText, Check, X, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

function DocumentUpload() {
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [documentType, setDocumentType] = useState('');
  const { user } = useAuth();

  const requiredDocuments = user?.role === 'DRIVER' 
    ? ['LICENSE', 'AADHAR'] 
    : ['AADHAR'];



  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        alert('Please select a valid image (JPG, PNG) or PDF file');
        return;
      }
      
      // Validate file size (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB');
        return;
      }
      
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    alert('Document upload feature is not available.');
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'VERIFIED':
        return <Check size={20} color="#28a745" />;
      case 'REJECTED':
        return <X size={20} color="#dc3545" />;
      case 'PENDING':
        return <AlertCircle size={20} color="#ffc107" />;
      default:
        return <FileText size={20} color="#6c757d" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'VERIFIED': return '#28a745';
      case 'REJECTED': return '#dc3545';
      case 'PENDING': return '#ffc107';
      default: return '#6c757d';
    }
  };

  const getDocumentStatus = () => {
    return 'NOT_UPLOADED';
  };

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
      <h2>Document Verification</h2>
      
      {/* Upload Section */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <h3>Upload Documents</h3>
        <p style={{ color: '#666', marginBottom: '1rem' }}>
          Please upload the required documents for verification. Accepted formats: JPG, PNG, PDF (Max 10MB)
        </p>
        
        <div style={{ display: 'grid', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Document Type
            </label>
            <select
              value={documentType}
              onChange={(e) => setDocumentType(e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem',
                border: '1px solid #ddd',
                borderRadius: '0.25rem'
              }}
            >
              <option value="">Select document type</option>
              {requiredDocuments.map(type => (
                <option key={type} value={type}>
                  {type === 'LICENSE' ? 'Driving License' : 'Aadhar Card'}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Select File
            </label>
            <input
              type="file"
              accept="image/*,.pdf"
              onChange={handleFileSelect}
              disabled={uploading}
              style={{
                width: '100%',
                padding: '0.5rem',
                border: '1px solid #ddd',
                borderRadius: '0.25rem'
              }}
            />
          </div>
        </div>
        
        {selectedFile && (
          <div style={{ 
            padding: '0.5rem', 
            backgroundColor: '#f8f9fa', 
            borderRadius: '0.25rem',
            marginBottom: '1rem'
          }}>
            <strong>Selected:</strong> {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
          </div>
        )}
        
        <button
          onClick={handleUpload}
          disabled={!selectedFile || !documentType || uploading}
          className="btn btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <Upload size={20} />
          {uploading ? 'Uploading...' : 'Upload Document'}
        </button>
      </div>

      {/* Document Status */}
      <div className="card">
        <h3>Document Status</h3>
        
        <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
          Document verification feature is not available.
        </div>
      </div>
    </div>
  );
}

export default DocumentUpload;