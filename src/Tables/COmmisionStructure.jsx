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
  const [isAddModalOpen, setAddModalOpen] = React.useState(false);
  const [isEditModalOpen, setEditModalOpen] = React.useState(null);

  const fetchRanges = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/finance/commission_structure');
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

  const handleAddRange = async (formData) => {
    try {
      const response = await fetch('http://localhost:8000/api/finance/commission_structure', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lower_limit: parseFloat(formData.lower_limit),
          upper_limit: parseFloat(formData.upper_limit),
          percentage: parseFloat(formData.percentage),
        }),
      });
      const newRange = await response.json();
      setRanges((prev) => [...prev, newRange]);
    } catch (error) {
      console.error('Error adding commission range:', error);
    }
  };

  const handleUpdateRange = async (rangeId, formData) => {
    try {
      const response = await fetch(`http://localhost:8000/api/finance/commission_structure`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
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
        await fetch(`http://localhost:8000/api/finance/commission_structure`, {
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
      <div style={{ marginBottom: '16px' }}>
        <button onClick={() => setAddModalOpen(true)} style={{
          padding: '10px 20px', backgroundColor: '#2d3748', color: '#fff',
          border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '14px',
          fontFamily: 'inherit'
        }}>
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
        isOpen={isAddModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSubmit={handleAddRange}
        title="Add Commission Range"
      />

      <Modal
        isOpen={!!isEditModalOpen}
        onClose={() => setEditModalOpen(null)}
        onSubmit={(formData) => handleUpdateRange(isEditModalOpen.id, formData)}
        title="Edit Commission Range"
        initialData={isEditModalOpen || {}}
      />
    
 
  {/* 🖌️ Google Font Import & Global CSS Update */}
<style>{`
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');

  * {
    font-family: 'Inter', sans-serif;
  }

  table {
    width: 100%;
    border-collapse: collapse;
  }

  th, td {
    padding: 12px 18px;
    font-size: 14px;
  }

  thead tr {
    background-color: #f7fafc;
    text-transform: uppercase;
    color: #4a5568;
  }

  tbody tr:hover {
    background-color: #f9fafb;
  }

  button {
    font-family: 'Inter', sans-serif;
    font-weight: 500;
  }

  .action-button {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 14px;
    padding: 6px 8px;
  }

  .action-button.edit {
    color: #3182ce;
    margin-right: 8px;
  }

  .action-button.delete {
    color: #e53e3e;
  }

  .modal-input {
    width: 100%;
    padding: 10px;
    font-size: 14px;
    border-radius: 6px;
    border: 1px solid #cbd5e0;
    margin-top: 6px;
  }

  .modal-label {
    font-size: 14px;
    font-weight: 500;
    margin-bottom: 4px;
    display: block;
    color: #4a5568;
  }

  .modal-buttons {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 16px;
  }

  .modal-buttons button {
    padding: 8px 16px;
    border-radius: 4px;
    border: none;
    font-size: 14px;
    cursor: pointer;
  }

  .modal-buttons .cancel {
    background-color: #edf2f7;
    color: #2d3748;
  }

  .modal-buttons .save {
    background-color: #2d3748;
    color: #fff;
  }
`}</style>
</div>
);
}
