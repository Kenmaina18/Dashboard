import * as React from 'react';

function Modal({ isOpen, onClose, onSubmit, title, initialData = [] }) {
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
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '8px',
        width: '100%',
        maxWidth: '420px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
        fontFamily: 'Inter, sans-serif'
      }}>
        <h3 style={{ marginBottom: '16px', color: '#2d3748', fontSize: '18px', fontWeight: 600 }}>{title}</h3>
        <form onSubmit={handleSubmit}>
          {['lower_limit', 'upper_limit', 'percentage'].map((field, index) => (
            <div key={index} style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '14px', marginBottom: '4px', color: '#4a5568' }}>
                {field === 'lower_limit' ? 'Lower Limit (Ksh)' :
                  field === 'upper_limit' ? 'Upper Limit (Ksh)' : 'Percentage (%)'}
              </label>
              <input
                type="number"
                name={field}
                value={formData[field] || ''}
                onChange={handleChange}
                step="0.01"
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e0',
                  fontSize: '14px',
                  fontFamily: 'inherit'
                }}
                required
              />
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button type="button" onClick={onClose} style={{
              backgroundColor: '#edf2f7', padding: '8px 16px',
              borderRadius: '4px', border: 'none', cursor: 'pointer',
              fontFamily: 'inherit'
            }}>
              Cancel
            </button>
            <button type="submit" style={{
              backgroundColor: '#2d3748', color: '#fff',
              padding: '8px 16px', borderRadius: '4px',
              border: 'none', cursor: 'pointer',
              fontFamily: 'inherit'
            }}>
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function CommissionRangeTable() {
  const [ranges, setRanges] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [isEditModalOpen, setEditModalOpen] = React.useState(null);
  const [isAddModalOpen, setAddModalOpen] = React.useState(false);

  const fetchRanges = async () => {
    try {
      const response = await fetch('https://sandbox.erp.optiven.co.ke/api/finance/commission_structure');
      const data = await response.json();
      setRanges(data);
    } catch (error) {
      console.error('Error fetching commission ranges:', error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchRanges();
  }, []);

  const handleNewData = async (formData) => {
    const { lower_limit, upper_limit, percentage } = formData;
  
    // Validate the data before sending the POST request
    if (isNaN(lower_limit) || isNaN(upper_limit) || isNaN(percentage)) {
      alert('All fields must contain valid numbers.');
      return;
    }
  
    if (lower_limit <= 0 || upper_limit <= 0 || percentage <= 0) {
      alert('Limits and percentage must be greater than zero.');
      return;
    }
  
    try {
      const response = await fetch(`https://sandbox.erp.optiven.co.ke/api/finance/commission_structure`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lower_limit: parseFloat(lower_limit),
          upper_limit: parseFloat(upper_limit),
          percentage: parseFloat(percentage),
        }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to create the commission range.');
      }
  
      const newRange = await response.json();
  
      // Add new range to the list
      setRanges((prev) => [...prev, newRange]);
      setAddModalOpen(false);
    } catch (error) {
      console.error('Error creating commission range:', error);
      alert('Failed to create commission range. Please try again.');
    }
  };

  const handleUpdateRange = async (rangeId, formData) => {
    const { lower_limit, upper_limit, percentage } = formData;

    // Validate the data before sending the PUT request
    if (isNaN(lower_limit) || isNaN(upper_limit) || isNaN(percentage)) {
      alert('All fields must contain valid numbers.');
      return;
    }

    if (lower_limit <= 0 || upper_limit <= 0 || percentage <= 0) {
      alert('Limits and percentage must be greater than zero.');
      return;
    }

    try {
      const response = await fetch(`https://sandbox.erp.optiven.co.ke/api/finance/commission_structure/${rangeId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lower_limit: parseFloat(lower_limit),
          upper_limit: parseFloat(upper_limit),
          percentage: parseFloat(percentage),
        }),
      });
      const updatedRange = await response.json();
      setRanges((prev) => prev.map((range) => (range.id === rangeId ? updatedRange : range)));
    } catch (error) {
      console.error('Error updating commission range:', error);
    }
  };

  const handleDeleteRange = async (rangeId) => {
    if (window.confirm('Are you sure you want to delete this commission range?')) {
      try {
        await fetch(`https://sandbox.erp.optiven.co.ke/api/finance/commission_structure/${rangeId}`, {
          method: 'DELETE',
        });
        setRanges((prev) => prev.filter((range) => range.id !== rangeId));
      } catch (error) {
        console.error('Error deleting commission range:', error);
      }
    }
  };

  const formatCurrency = (value) => `Ksh ${new Intl.NumberFormat().format(value)}`;

  return (
    <div style={{ padding: '16px', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'flex-end' }}>
        <button 
          onClick={() => setAddModalOpen(true)} 
          style={{
            backgroundColor: '#2d3748', 
            color: '#fff',
            padding: '8px 16px', 
            borderRadius: '4px',
            border: 'none', 
            cursor: 'pointer',
            fontFamily: 'inherit'
          }}
        >
          Add Commission Range
        </button>
      </div>

      <div style={{
        overflowX: 'auto',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        borderRadius: '8px',
        backgroundColor: '#fff',
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f7fafc', textTransform: 'uppercase', fontSize: '13px', color: '#4a5568' }}>
              <th style={{ padding: '12px 16px', textAlign: 'left' }}>ID</th>
              <th style={{ padding: '12px 16px', textAlign: 'right' }}>Lower Limit</th>
              <th style={{ padding: '12px 16px', textAlign: 'right' }}>Upper Limit</th>
              <th style={{ padding: '12px 16px', textAlign: 'right' }}>Percentage</th>
              <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} style={{ padding: '16px', textAlign: 'center', color: '#718096' }}>
                  Loading...
                </td>
              </tr>
            ) : ranges.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: '16px', textAlign: 'center', color: '#718096' }}>
                  No commission ranges found.
                </td>
              </tr>
            ) : (
              ranges.map((range) => (
                <tr key={range.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '12px 16px', fontWeight: 600 }}>{range.id}</td>
                  <td style={{ padding: '12px 16px', textAlign: 'right' }}>{formatCurrency(range.lower_limit)}</td>
                  <td style={{ padding: '12px 16px', textAlign: 'right' }}>{formatCurrency(range.upper_limit)}</td>
                  <td style={{ padding: '12px 16px', textAlign: 'right' }}>{range.percentage}%</td>
                  <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                    <button onClick={() => setEditModalOpen(range)} style={{
                      color: '#3182ce', border: 'none', background: 'none',
                      cursor: 'pointer', marginRight: '10px'
                    }}>Edit</button>
                    <button onClick={() => handleDeleteRange(range.id)} style={{
                      color: '#e53e3e', border: 'none', background: 'none',
                      cursor: 'pointer'
                    }}>Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={!!isEditModalOpen}
        onClose={() => setEditModalOpen(null)}
        onSubmit={(formData) => handleUpdateRange(isEditModalOpen.id, formData)}
        title="Edit Commission Range"
        initialData={isEditModalOpen || {}}
      />

      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSubmit={handleNewData}
        title="Add Commission Range"
        initialData={{}}
      />
    </div>
  );
}

