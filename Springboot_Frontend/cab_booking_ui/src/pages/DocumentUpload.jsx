import { useState, useEffect } from 'react';
import { Upload, FileText, Check, X, AlertCircle } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';

function DocumentUpload() {
  const [documents, setDocuments] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [documentType, setDocumentType] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const requiredDocuments = user?.role === 'DRIVER' 
    ? ['LICENSE', 'AADHAR'] 
    : ['AADHAR'];

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      setError(null);
      setDocuments([]);
    } catch (error) {
      console.error('Failed to fetch documents:', error);
      setError('Document feature not available.');
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  };

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

  const getDocumentStatus = (docType) => {
    const doc = documents.find(d => d.documentType === docType);
    return doc ? doc.verificationStatus : 'NOT_UPLOADED';
  };

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
      <h2>Document Verification</h2>
      
      {error && (
        <div style={{
          padding: '1rem',
          backgroundColor: '#fff3cd',
          border: '1px solid #ffc107',
          borderRadius: '0.5rem',
          color: '#856404',
          marginBottom: '2rem'
        }}>
          <strong>⚠️ Error:</strong> {error}
        </div>
      )}
      
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
        
        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
            Loading documents...
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '1rem' }}>
            {requiredDocuments.map(docType => {
              const status = getDocumentStatus(docType);
              const doc = documents.find(d => d.documentType === docType);
              
              return (
                <div
                  key={docType}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '1rem',
                    border: '1px solid #ddd',
                    borderRadius: '0.5rem',
                    backgroundColor: status === 'VERIFIED' ? '#f8fff8' : 
                                   status === 'REJECTED' ? '#fff8f8' : 
                                   status === 'PENDING' ? '#fffbf0' : '#f8f9fa'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    {getStatusIcon(status)}
                    <div>
                      <h4 style={{ margin: 0 }}>
                        {docType === 'LICENSE' ? 'Driving License' : 'Aadhar Card'}
                      </h4>
                      {doc && (
                        <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.9rem', color: '#666' }}>
                          Uploaded: {new Date(doc.uploadedAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div style={{ textAlign: 'right' }}>
                    <span
                      style={{
                        padding: '0.25rem 0.5rem',
                        borderRadius: '0.25rem',
                        fontSize: '0.8rem',
                        fontWeight: 'bold',
                        color: 'white',
                        backgroundColor: getStatusColor(status)
                      }}
                    >
                      {status === 'NOT_UPLOADED' ? 'NOT UPLOADED' : status}
                    </span>
                    
                    {status === 'REJECTED' && (
                      <p style={{ 
                        margin: '0.5rem 0 0 0', 
                        fontSize: '0.8rem', 
                        color: '#dc3545',
                        fontStyle: 'italic'
                      }}>
                        Please upload a new document
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
        
        {!loading && documents.length > 0 && (
          <div style={{ 
            marginTop: '1rem', 
            padding: '1rem', 
            backgroundColor: '#e3f2fd', 
            borderRadius: '0.5rem' 
          }}>
            <p style={{ margin: 0, fontSize: '0.9rem', color: '#1976d2' }}>
              <strong>Note:</strong> Your account will be verified once all documents are approved by the admin.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default DocumentUpload;