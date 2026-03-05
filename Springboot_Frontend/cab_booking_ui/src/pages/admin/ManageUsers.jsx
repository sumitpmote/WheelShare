import { useState, useEffect } from 'react';
import { Eye, Check, X, FileText, ExternalLink } from 'lucide-react';
import api from '../../services/api';

function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userDocuments, setUserDocuments] = useState([]);
  const [showDocuments, setShowDocuments] = useState(false);
  const [showDocumentViewer, setShowDocumentViewer] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);

  const fetchUsers = async () => {
    try {
      console.log('Fetching users with filter:', filter);
      const response = await api.get(`/admin/users?filter=${filter}`);
      console.log('Users response:', response.data);
      setUsers(response.data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      console.error('Error details:', error.response?.data);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserDocuments = async (userId) => {
    setUserDocuments([]);
    setShowDocuments(true);
  };

  useEffect(() => {
    fetchUsers();
  }, [filter]);

  const handleVerify = async (userId) => {
    try {
      await api.post(`/admin/users/${userId}/verify`);
      fetchUsers();
    } catch (error) {
      console.error('Failed to verify user:', error);
    }
  };

  const handleApproveDocument = async (docId) => {
    try {
      await api.put(`/document/${docId}/verify`);
      fetchUserDocuments(selectedUser.userId);
      fetchUsers();
    } catch (error) {
      console.error('Failed to approve document:', error);
    }
  };

  const handleRejectDocument = async (docId) => {
    try {
      await api.put(`/document/${docId}/reject`);
      fetchUserDocuments(selectedUser.userId);
      fetchUsers();
    } catch (error) {
      console.error('Failed to reject document:', error);
    }
  };

  const viewDocument = (doc) => {
    setSelectedDocument(doc);
    setShowDocumentViewer(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'VERIFIED': return '#28a745';
      case 'REJECTED': return '#dc3545';
      case 'PENDING': return '#ffc107';
      default: return '#6c757d';
    }
  };

  const getStatusBadge = (status) => {
    const color = getStatusColor(status);
    return (
      <span style={{
        padding: '0.25rem 0.5rem',
        borderRadius: '0.25rem',
        fontSize: '0.75rem',
        fontWeight: 'bold',
        color: 'white',
        backgroundColor: color
      }}>
        {status}
      </span>
    );
  };

  if (loading) return <div className="container" style={{ paddingTop: '2rem' }}>Loading users...</div>;

  if (users.length === 0) {
    return (
      <div className="container" style={{ paddingTop: '2rem' }}>
        <h2>Manage Users</h2>
        <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
          <p>No users found. Check console for API response details.</p>
          <button onClick={fetchUsers} className="btn btn-primary">Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: '2rem' }}>
      <h2>Manage Users</h2>
      
      {/* Filter Buttons */}
      <div style={{ marginBottom: '1rem' }}>
        {['all', 'verified', 'pending'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`btn ${filter === f ? 'btn-primary' : 'btn-outline'}`}
            style={{ marginRight: '0.5rem', textTransform: 'capitalize' }}
          >
            {f} ({users.filter(u => f === 'all' || 
              (f === 'verified' && u.verificationStatus === 'VERIFIED') ||
              (f === 'pending' && u.verificationStatus === 'PENDING')
            ).length})
          </button>
        ))}
      </div>

      {/* Users Table */}
      <div className="card">
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #ddd', backgroundColor: '#f8f9fa' }}>
                <th style={{ padding: '1rem 0.5rem', textAlign: 'left' }}>ID</th>
                <th style={{ padding: '1rem 0.5rem', textAlign: 'left' }}>Name</th>
                <th style={{ padding: '1rem 0.5rem', textAlign: 'left' }}>Email</th>
                <th style={{ padding: '1rem 0.5rem', textAlign: 'left' }}>Role</th>
                <th style={{ padding: '1rem 0.5rem', textAlign: 'left' }}>Documents</th>
                <th style={{ padding: '1rem 0.5rem', textAlign: 'left' }}>Verification</th>
                <th style={{ padding: '1rem 0.5rem', textAlign: 'left' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.userId} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '0.75rem 0.5rem' }}>{user.userId}</td>
                  <td style={{ padding: '0.75rem 0.5rem', fontWeight: '500' }}>{user.name}</td>
                  <td style={{ padding: '0.75rem 0.5rem', fontSize: '0.9rem', color: '#666' }}>{user.email}</td>
                  <td style={{ padding: '0.75rem 0.5rem' }}>
                    <span style={{
                      padding: '0.25rem 0.5rem',
                      borderRadius: '0.25rem',
                      fontSize: '0.75rem',
                      fontWeight: 'bold',
                      backgroundColor: user.role === 'DRIVER' ? '#e3f2fd' : '#f3e5f5',
                      color: user.role === 'DRIVER' ? '#1976d2' : '#7b1fa2'
                    }}>
                      {user.role}
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem 0.5rem' }}>
                    <span style={{ color: '#999', fontSize: '0.9rem' }}>No documents</span>
                  </td>
                  <td style={{ padding: '0.75rem 0.5rem' }}>
                    {getStatusBadge(user.verificationStatus)}
                  </td>
                  <td style={{ padding: '0.75rem 0.5rem' }}>
                    <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
                      {user.verificationStatus !== 'VERIFIED' && (
                        <button
                          onClick={() => handleVerify(user.userId)}
                          className="btn btn-success"
                          style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}
                          title="Verify User"
                        >
                          <Check size={14} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Document Modal */}
      {showDocuments && selectedUser && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '0.5rem',
            padding: '2rem',
            maxWidth: '600px',
            width: '90%',
            maxHeight: '80vh',
            overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3>Documents - {selectedUser.name}</h3>
              <button 
                onClick={() => setShowDocuments(false)}
                className="btn btn-outline"
                style={{ padding: '0.25rem 0.5rem' }}
              >
                <X size={16} />
              </button>
            </div>
            
            {userDocuments.length === 0 ? (
              <p>No documents uploaded</p>
            ) : (
              <div style={{ display: 'grid', gap: '1rem' }}>
                {userDocuments.map((doc, index) => (
                  <div key={index} className="card" style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <h4 style={{ margin: 0 }}>{doc.documentType}</h4>
                      {getStatusBadge(doc.verificationStatus)}
                    </div>
                    
                    <p style={{ margin: '0.5rem 0', fontSize: '0.9rem', color: '#666' }}>
                      Document: {doc.documentType} | Uploaded: {new Date(doc.uploadedAt).toLocaleDateString()}
                    </p>
                    
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <button 
                        onClick={() => window.open(doc.viewUrl, '_blank')}
                        className="btn btn-outline"
                        style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
                      >
                        <Eye size={16} style={{ marginRight: '0.25rem' }} />
                        View Document
                      </button>
                      
                      {doc.verificationStatus === 'PENDING' && (
                        <>
                          <button
                            onClick={() => handleApproveDocument(doc.documentId)}
                            className="btn btn-success"
                            style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
                          >
                            <Check size={16} style={{ marginRight: '0.25rem' }} />
                            Approve
                          </button>
                          <button
                            onClick={() => handleRejectDocument(doc.documentId)}
                            className="btn btn-danger"
                            style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
                          >
                            <X size={16} style={{ marginRight: '0.25rem' }} />
                            Reject
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Document Viewer Modal */}
      {showDocumentViewer && selectedDocument && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1001
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '0.5rem',
            padding: '1rem',
            maxWidth: '90%',
            maxHeight: '90%',
            overflow: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3>{selectedDocument.documentType} - {selectedDocument.fileName}</h3>
              <button 
                onClick={() => setShowDocumentViewer(false)}
                className="btn btn-outline"
                style={{ padding: '0.25rem 0.5rem' }}
              >
                <X size={16} />
              </button>
            </div>
            
            {selectedDocument.fileType.startsWith('image/') ? (
              <img 
                src={selectedDocument.base64Data} 
                alt={selectedDocument.fileName}
                style={{ maxWidth: '100%', maxHeight: '70vh', objectFit: 'contain' }}
              />
            ) : selectedDocument.fileType === 'application/pdf' ? (
              <iframe 
                src={selectedDocument.base64Data}
                style={{ width: '100%', height: '70vh', border: 'none' }}
                title={selectedDocument.fileName}
              />
            ) : (
              <p>Cannot preview this file type. File: {selectedDocument.fileName}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageUsers;