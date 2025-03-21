import * as React from 'react';

function Modal({ isOpen, onClose, onSubmit, title, initialData = {} }) {
  const [formData, setFormData] = React.useState(initialData);

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
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
      <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', width: '400px', maxWidth: '90%' }}>
        <h3 style={{ marginBottom: '15px', color: '#2d3748' }}>{title}</h3>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '10px' }}>
            <label style={{ display: 'block', fontSize: '14px', color: '#4a5568', marginBottom: '5px' }}>Lower Limit ($)</label>
            <input
              type="number"
              name="lower_limit"
              value={formData.lower_limit || ''}
              onChange={handleChange}
              step="0.01"
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #e2e8f0' }}
              required
            />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label style={{ display: 'block', fontSize: '14px', color: '#4a5568', marginBottom: '5px' }}>Upper Limit ($)</label>
            <input
              type="number"
              name="upper_limit"
              value={formData.upper_limit || ''}
              onChange={handleChange}
              step="0.01"
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #e2e8f0' }}
              required
            />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label style={{ display: 'block', fontSize: '14px', color: '#4a5568', marginBottom: '5px' }}>Percentage (%)</label>
            <input
              type="number"
              name="percentage"
              value={formData.percentage || ''}
              onChange={handleChange}
              step="0.01"
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #e2e8f0' }}
              required
            />
          </div>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={onClose}
              style={{ padding: '8px 16px', backgroundColor: '#e2e8f0', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{ padding: '8px 16px', backgroundColor: '#2d3748', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
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
      const response = await fetch('/api/commission-ranges');
      if (!response.ok) throw new Error('Failed to fetch commission ranges');
      const data = await response.json();
      setRanges(data);
    } catch (error) {
      console.error('Error fetching commission ranges:', error);
      setRanges([]);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchRanges();
  }, []);

  const handleAddRange = async (formData) => {
    try {
      const response = await fetch('/api/commission-ranges', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lower_limit: parseFloat(formData.lower_limit),
          upper_limit: parseFloat(formData.upper_limit),
          percentage: parseFloat(formData.percentage),
        }),
      });
      if (!response.ok) throw new Error('Failed to add commission range');
      const newRange = await response.json();
      setRanges((prev) => [...prev, newRange]);
    } catch (error) {
      console.error('Error adding commission range:', error);
    }
  };

  const handleUpdateRange = async (rangeId, formData) => {
    try {
      const response = await fetch(`/api/commission-ranges/${rangeId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lower_limit: parseFloat(formData.lower_limit),
          upper_limit: parseFloat(formData.upper_limit),
          percentage: parseFloat(formData.percentage),
        }),
      });
      if (!response.ok) throw new Error('Failed to update commission range');
      const updatedRange = await response.json();
      setRanges((prev) =>
        prev.map((range) => (range.id === rangeId ? updatedRange : range))
      );
    } catch (error) {
      console.error('Error updating commission range:', error);
    }
  };

  const handleDeleteRange = async (rangeId) => {
    if (window.confirm('Are you sure you want to delete this commission range?')) {
      try {
        const response = await fetch(`/api/commission-ranges/${rangeId}`, {
          method: 'DELETE',
        });
        if (!response.ok) throw new Error('Failed to delete commission range');
        setRanges((prev) => prev.filter((range) => range.id !== rangeId));
      } catch (error) {
        console.error('Error deleting commission range:', error);
      }
    }
  };

  return (
    <>
      <div style={{ marginBottom: '15px' }}>
        <button
          onClick={() => setAddModalOpen(true)}
          style={{ padding: '8px 16px', backgroundColor: '#2d3748', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Add Commission Range
        </button>
      </div>
      <div
        style={{
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)',
          borderRadius: '8px',
          overflow: 'hidden',
          backgroundColor: '#fff',
          maxWidth: '100%',
          margin: '0 auto',
        }}
      >
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            tableLayout: 'fixed',
          }}
          aria-label="commission ranges table"
        >
          <thead>
            <tr className="header-row">
              <th style={{ textAlign: 'left' }}>Range ID</th>
              <th align="right">Lower Limit (kes)</th>
              <th align="right">Upper Limit (kes)</th>
              <th align="right">Percentage (%)</th>
              <th align="right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} style={{ padding: '16px', textAlign: 'center', color: '#718096' }}>
                  Loading commission ranges...
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
                <tr key={range.id} className="main-row">
                  <th scope="row" style={{ fontWeight: '600' }}>{range.id}</th>
                  <td align="right">kes{range.lower_limit.toFixed(2)}</td>
                  <td align="right">kes{range.upper_limit.toFixed(2)}</td>
                  <td align="right">{range.percentage.toFixed(2)}%</td>
                  <td align="right">
                    <button
                      onClick={() => setEditModalOpen(range)}
                      style={{ background: 'none', border: 'none', color: '#4299e1', cursor: 'pointer', marginRight: '10px' }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteRange(range.id)}
                      style={{ background: 'none', border: 'none', color: '#e53e3e', cursor: 'pointer' }}
                    >
                      Delete
                    </button>
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
        initialData={{}}
      />
      <Modal
        isOpen={!!isEditModalOpen}
        onClose={() => setEditModalOpen(null)}
        onSubmit={(formData) => handleUpdateRange(isEditModalOpen.id, formData)}
        title="Edit Commission Range"
        initialData={isEditModalOpen || {}}
      />

      {/* Global Styles */}
      <style jsx>{`
        .header-row {
          background-color: #f4f7fa;
          color: #2d3748;
          font-size: 14px;
          font-weight: 600;
          text-transform: uppercase;
        }

        .header-row th {
          padding: 16px;
          border-bottom: 2px solid #e2e8f0;
        }

        .main-row {
          transition: background-color 0.2s ease;
        }

        .main-row:hover {
          background-color: #f7fafc;
        }

        .main-row td,
        .main-row th {
          padding: 16px;
          border-bottom: 1px solid #e2e8f0;
          font-size: 14px;
          color: #4a5568;
        }

        @media (max-width: 768px) {
          table {
            display: block;
            overflow-x: auto;
            white-space: nowrap;
          }

          .main-row td,
          .main-row th,
          .header-row th {
            padding: 12px;
            min-width: 100px;
          }
        }
      `}</style>
    </>
  );
}