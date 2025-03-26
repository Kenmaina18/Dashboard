import React, { useState, useEffect } from 'react';

function CommissionPeriodTable() {
  const [periods, setPeriods] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentPeriod, setCurrentPeriod] = useState({
    start_date: null,
    end_date: null,
    status: 'DRAFT'
  });

  // Fetch Periods
  const fetchPeriods = async () => {
    try {
      const response = await fetch('https://sandbox.erp.optiven.co.ke/api/finance/marketing_period');
      const data = await response.json();
      setPeriods(data);
    } catch (error) {
      console.error('Error fetching periods:', error);
    }
  };

  // Create New Period
  const handleCreatePeriod = async () => {
    try {
      const response = await fetch('https://sandbox.erp.optiven.co.ke/api/finance/marketing_period', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(currentPeriod)
      });
      
      if (response.ok) {
        const newPeriod = await response.json();
        setPeriods([...periods, newPeriod]);
        setIsAddModalOpen(false);
        // Reset current period
        setCurrentPeriod({
          start_date: null,
          end_date: null,
          status: 'DRAFT'
        });
      }
    } catch (error) {
      console.error('Error creating period:', error);
    }
  };

  // Update Existing Period
  const handleUpdatePeriod = async () => {
    try {
      const response = await fetch(`https://sandbox.erp.optiven.co.ke/api/finance/marketing_period/${currentPeriod.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(currentPeriod)
      });
      
      if (response.ok) {
        const updatedPeriod = await response.json();
        setPeriods(periods.map(p => p.id === updatedPeriod.id ? updatedPeriod : p));
        setIsEditModalOpen(false);
      }
    } catch (error) {
      console.error('Error updating period:', error);
    }
  };

  // Delete Period
  const handleDeletePeriod = async (id) => {
    if (window.confirm('Delete this commission period?')) {
      try {
        await fetch(`https://sandbox.erp.optiven.co.ke/api/finance/marketing_period/${id}`, { method: 'DELETE' });
        setPeriods((prev) => prev.filter((p) => p.id !== id));
      } catch (error) {
        console.error('Error deleting period:', error);
      }
    }
  };

  // Fetch Transactions
  const fetchTransactions = async (Id) => {
    try {
      const response = await fetch(`https://sandbox.erp.optiven.co.ke/api/commission/highest`);
      const data = await response.json();
      setTransactions(data);
      console.log('Transactions:', data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  // Open Edit Modal
  const openEditModal = (period) => {
    setCurrentPeriod(period);
    setIsEditModalOpen(true);
  };

  useEffect(() => {
    fetchPeriods();
  }, []);

  // Modal Styles
  const modalStyles = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    },
    modal: {
      backgroundColor: 'white',
      padding: '20px',
      borderRadius: '8px',
      width: '500px',
      maxWidth: '90%',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
    },
    input: {
      width: '100%',
      padding: '10px',
      marginBottom: '10px',
      border: '1px solid #ddd',
      borderRadius: '4px'
    },
    button: {
      padding: '10px 15px',
      margin: '5px',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer'
    }
  };

  // Render Modals
  const renderAddModal = () => {
    if (!isAddModalOpen) return null;

    return (
      <div style={modalStyles.overlay} onClick={() => setIsAddModalOpen(false)}>
        <div 
          style={modalStyles.modal} 
          onClick={(e) => e.stopPropagation()}
        >
          <h2>Add Commission Period</h2>
          
          <div>
            <label>Start Date</label>
            <input 
              type="date" 
              style={modalStyles.input}
              value={currentPeriod.start_date ? new Date(currentPeriod.start_date).toISOString().split('T')[0] : ''}
              onChange={(e) => setCurrentPeriod(prev => ({
                ...prev, 
                start_date: new Date(e.target.value)
              }))}
            />
          </div>
          
          <div>
            <label>End Date</label>
            <input 
              type="date" 
              style={modalStyles.input}
              value={currentPeriod.end_date ? new Date(currentPeriod.end_date).toISOString().split('T')[0] : ''}
              onChange={(e) => setCurrentPeriod(prev => ({
                ...prev, 
                end_date: new Date(e.target.value)
              }))}
            />
          </div>
          
          <div>
            <label>Status</label>
            <select 
              style={modalStyles.input}
              value={currentPeriod.status}
              onChange={(e) => setCurrentPeriod(prev => ({
                ...prev, 
                status: e.target.value
              }))}
            >
              <option value="DRAFT">Draft</option>
              <option value="ACTIVE">Active</option>
              <option value="CLOSED">Closed</option>
            </select>
          </div>
          
          <div>
            <button 
              style={{...modalStyles.button, backgroundColor: '#4CAF50', color: 'white'}}
              onClick={handleCreatePeriod}
            >
              Create Period
            </button>
            <button 
              style={{...modalStyles.button, backgroundColor: '#f44336', color: 'white'}}
              onClick={() => setIsAddModalOpen(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderEditModal = () => {
    if (!isEditModalOpen) return null;

    return (
      <div style={modalStyles.overlay} onClick={() => setIsEditModalOpen(false)}>
        <div 
          style={modalStyles.modal} 
          onClick={(e) => e.stopPropagation()}
        >
          <h2>Edit Commission Period</h2>
          
          <div>
            <label>Start Date</label>
            <input 
              type="date" 
              style={modalStyles.input}
              value={currentPeriod.start_date ? new Date(currentPeriod.start_date).toISOString().split('T')[0] : ''}
              onChange={(e) => setCurrentPeriod(prev => ({
                ...prev, 
                start_date: new Date(e.target.value)
              }))}
            />
          </div>
          
          <div>
            <label>End Date</label>
            <input 
              type="date" 
              style={modalStyles.input}
              value={currentPeriod.end_date ? new Date(currentPeriod.end_date).toISOString().split('T')[0] : ''}
              onChange={(e) => setCurrentPeriod(prev => ({
                ...prev, 
                end_date: new Date(e.target.value)
              }))}
            />
          </div>
          
          <div>
            <label>Status</label>
            <select 
              style={modalStyles.input}
              value={currentPeriod.status}
              onChange={(e) => setCurrentPeriod(prev => ({
                ...prev, 
                status: e.target.value
              }))}
            >
              <option value="DRAFT">Draft</option>
              <option value="ACTIVE">Active</option>
              <option value="CLOSED">Closed</option>
            </select>
          </div>
          
          <div>
            <button 
              style={{...modalStyles.button, backgroundColor: '#4CAF50', color: 'white'}}
              onClick={handleUpdatePeriod}
            >
              Update Period
            </button>
            <button 
              style={{...modalStyles.button, backgroundColor: '#f44336', color: 'white'}}
              onClick={() => setIsEditModalOpen(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={{ padding: '16px', fontFamily: 'Arial, sans-serif' }}>
      {/* Add Period Button */}
      <button 
        onClick={() => setIsAddModalOpen(true)}
        style={{
          ...modalStyles.button, 
          backgroundColor: '#2196F3', 
          color: 'white',
          marginBottom: '16px'
        }}
      >
        Add Commission Period
      </button>

      {/* Periods Table */}
      <div style={{
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        borderRadius: '8px',
        overflow: 'hidden',
        backgroundColor: '#fff'
      }}>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: '14px',
          minWidth: '720px'
        }}>
          <thead>
            <tr style={{ backgroundColor: '#f1f1f1' }}>
              <th style={{ textAlign: 'left', padding: '14px' }}>ID</th>
              <th style={{ textAlign: 'right', padding: '14px' }}>Start Date</th>
              <th style={{ textAlign: 'right', padding: '14px' }}>End Date</th>
              <th style={{ textAlign: 'right', padding: '14px' }}>Status</th>
              <th style={{ textAlign: 'right', padding: '14px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {periods.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: '16px', textAlign: 'center', color: '#718096' }}>
                  No commission periods found.
                </td>
              </tr>
            ) : (
              periods.map((p) => (
                <tr key={p.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '12px 14px', fontWeight: 600 }}>{p.id}</td>
                  <td style={{ padding: '12px 14px', textAlign: 'right' }}>{new Date(p.start_date).toLocaleString()}</td>
                  <td style={{ padding: '12px 14px', textAlign: 'right' }}>{new Date(p.end_date).toLocaleString()}</td>
                  <td style={{ padding: '12px 14px', textAlign: 'right' }}>{p.status}</td>
                  <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                    <button
                      onClick={() => openEditModal(p)}
                      style={{ 
                        color: '#2196F3', 
                        border: 'none', 
                        background: 'none', 
                        cursor: 'pointer', 
                        marginRight: '10px' 
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeletePeriod(p.id)}
                      style={{ 
                        color: '#f44336', 
                        border: 'none', 
                        background: 'none', 
                        cursor: 'pointer', 
                        marginRight: '10px' 
                      }}
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => fetchTransactions(p.id)}
                      style={{ 
                        color: '#4CAF50', 
                        border: 'none', 
                        background: 'none', 
                        cursor: 'pointer' 
                      }}
                    >
                      View Transactions
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Transactions Section */}
      {transactions.length > 0 && (
        <div style={{ marginTop: '24px' }}>
          <h4 style={{ fontSize: '16px', marginBottom: '12px', fontWeight: '600' }}>
            Commission-Eligible Transactions
          </h4>
          <ul style={{ listStyleType: 'disc', paddingLeft: '20px' }}>
            {transactions.map((txn) => (
              <li key={txn.id}>
                {txn.marketer} – {txn.plot_number} – {txn.percentage}% – KES {txn.total_paid}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Modals */}
      {renderAddModal()}
      {renderEditModal()}
    </div>
  );
}

export default CommissionPeriodTable;
