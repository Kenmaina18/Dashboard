import * as React from 'react';

function Modal({ isOpen, onClose, onSubmit, title, initialData = {} }) {
  const [formData, setFormData] = React.useState(initialData);

  React.useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
      justifyContent: 'center', alignItems: 'center', zIndex: 1000
    }}>
      <div style={{
        backgroundColor: '#fff', padding: '24px', borderRadius: '10px',
        width: '420px', maxWidth: '90%', fontFamily: 'Inter, sans-serif',
        boxShadow: '0 10px 25px rgba(0,0,0,0.15)'
      }}>
        <h3 style={{ marginBottom: '16px', color: '#2d3748', fontSize: '18px', fontWeight: 600 }}>{title}</h3>
        <form onSubmit={handleSubmit}>
          {['start_date', 'end_date'].map((field) => (
            <div key={field} style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '14px', marginBottom: '6px', color: '#4a5568' }}>
                {field === 'start_date' ? 'Start Date' : 'End Date'}
              </label>
              <input
                type="datetime-local"
                name={field}
                value={formData[field] ? formData[field].slice(0, 16) : ''}
                onChange={handleChange}
                required
                style={{
                  width: '100%', padding: '10px', borderRadius: '6px',
                  border: '1px solid #cbd5e0', fontSize: '14px'
                }}
              />
            </div>
          ))}
          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', fontSize: '14px', marginBottom: '6px', color: '#4a5568' }}>Status</label>
            <select
              name="status"
              value={formData.status || ''}
              onChange={handleChange}
              required
              style={{
                width: '100%', padding: '10px', borderRadius: '6px',
                border: '1px solid #cbd5e0', fontSize: '14px'
              }}
            >
              <option value="">Select Status</option>
              <option value="Opened">Opened</option>
              <option value="Closed">Closed</option>
            </select>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button type="button" onClick={onClose} style={{
              backgroundColor: '#edf2f7', padding: '8px 16px',
              borderRadius: '4px', border: 'none', cursor: 'pointer'
            }}>Cancel</button>
            <button type="submit" style={{
              backgroundColor: '#2d3748', color: '#fff',
              padding: '8px 16px', borderRadius: '4px',
              border: 'none', cursor: 'pointer'
            }}>Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function CommissionPeriodTable() {
  const [periods, setPeriods] = React.useState([]);
  const [isAddModalOpen, setAddModalOpen] = React.useState(false);
  const [isEditModalOpen, setEditModalOpen] = React.useState(null);
  const [transactions, setTransactions] = React.useState([]);

  const fetchPeriods = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/finance/marketing_period');
      const data = await response.json();
      setPeriods(data);
    } catch (error) {
      console.error('Error fetching periods:', error);
    }
  };

  const handleAddPeriod = async (formData) => {
    try {
      const response = await fetch('http://localhost:8000/api/finance/marketing_period', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const newPeriod = await response.json();
      setPeriods((prev) => [...prev, newPeriod]);
    } catch (error) {
      console.error('Error adding period:', error);
    }
  };

  const handleUpdatePeriod = async (id, formData) => {
    try {
      const response = await fetch(`http://localhost:8000/api/finance/marketing_period/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const updatedPeriod = await response.json();
      setPeriods((prev) => prev.map((p) => (p.id === id ? updatedPeriod : p)));
    } catch (error) {
      console.error('Error updating period:', error);
    }
  };

  const handleDeletePeriod = async (id) => {
    if (window.confirm('Delete this commission period?')) {
      try {
        await fetch(`http://localhost:8000/api/finance/marketing_period/${id}`, { method: 'DELETE' });
        setPeriods((prev) => prev.filter((p) => p.id !== id));
      } catch (error) {
        console.error('Error deleting period:', error);
      }
    }
  };

  const fetchTransactions = async (periodId) => {
    try {
      const response = await fetch(`http://localhost:8000/api/commission/highest`);
      const data = await response.json();
      setTransactions(data);
      console.log('Transactions:', data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  React.useEffect(() => {
    fetchPeriods();
  }, []);

  return (
    <div style={{ padding: '16px', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ marginBottom: '16px' }}>
        <button
          onClick={() => setAddModalOpen(true)}
          style={{
            padding: '10px 18px', backgroundColor: '#2d3748',
            color: '#fff', border: 'none', borderRadius: '6px',
            fontSize: '15px', cursor: 'pointer'
          }}
        >
          + Add Commission Period
        </button>
      </div>

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
          <thead className="header-row">
            <tr>
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
                      onClick={() => setEditModalOpen(p)}
                      style={{ color: '#3182ce', border: 'none', background: 'none', cursor: 'pointer', marginRight: '10px' }}
                    >Edit</button>
                    <button
                      onClick={() => handleDeletePeriod(p.id)}
                      style={{ color: '#e53e3e', border: 'none', background: 'none', cursor: 'pointer', marginRight: '10px' }}
                    >Delete</button>
                    <button
                      onClick={() => fetchTransactions(p.id)}
                      style={{ color: '#38a169', border: 'none', background: 'none', cursor: 'pointer' }}
                    >View Transactions</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSubmit={handleAddPeriod}
        title="Add Commission Period"
      />
      <Modal
        isOpen={!!isEditModalOpen}
        onClose={() => setEditModalOpen(null)}
        onSubmit={(formData) => handleUpdatePeriod(isEditModalOpen.id, formData)}
        title="Edit Commission Period"
        initialData={isEditModalOpen || {}}
      />

      {transactions.length > 0 && (
        <div style={{ marginTop: '24px' }}>
          <h4 style={{ fontSize: '16px', marginBottom: '12px', fontWeight: '600' }}>Commission-Eligible Transactions</h4>
          <ul style={{ listStyleType: 'disc', paddingLeft: '20px' }}>
            {transactions.map((txn) => (
              <li key={txn.id}>{txn.marketer} – {txn.plot_number} – {txn.percentage}% – KES {txn.total_paid}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
