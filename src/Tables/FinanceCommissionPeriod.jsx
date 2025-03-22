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
  const [periods, setPeriods] = React.useState([
    {
      id: 1,
      start_date: "2025-01-01T00:00:00Z",
      end_date: "2025-03-31T23:59:59Z",
      status: "Opened",
    },
    {
      id: 2,
      start_date: "2025-04-01T00:00:00Z",
      end_date: "2025-06-30T23:59:59Z",
      status: "Closed",
    },
  ]);
  const [isAddModalOpen, setAddModalOpen] = React.useState(false);
  const [isEditModalOpen, setEditModalOpen] = React.useState(null);

  const handleAddPeriod = (formData) => {
    const newPeriod = {
      id: periods.length ? Math.max(...periods.map(p => p.id)) + 1 : 1,
      start_date: new Date(formData.start_date).toISOString(),
      end_date: new Date(formData.end_date).toISOString(),
      status: formData.status,
    };
    setPeriods((prev) => [...prev, newPeriod]);
  };

  const handleUpdatePeriod = (id, formData) => {
    setPeriods((prev) =>
      prev.map((period) =>
        period.id === id
          ? {
              ...period,
              start_date: new Date(formData.start_date).toISOString(),
              end_date: new Date(formData.end_date).toISOString(),
              status: formData.status,
            }
          : period
      )
    );
  };

  const handleDeletePeriod = (id) => {
    if (window.confirm('Delete this commission period?')) {
      setPeriods((prev) => prev.filter((p) => p.id !== id));
    }
  };

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
                  <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                    {new Date(p.start_date).toLocaleString()}
                  </td>
                  <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                    {new Date(p.end_date).toLocaleString()}
                  </td>
                  <td style={{ padding: '12px 14px', textAlign: 'right' }}>{p.status}</td>
                  <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                    <button
                      onClick={() => setEditModalOpen(p)}
                      style={{ color: '#3182ce', border: 'none', background: 'none', cursor: 'pointer', marginRight: '10px' }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeletePeriod(p.id)}
                      style={{ color: '#e53e3e', border: 'none', background: 'none', cursor: 'pointer' }}
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
    </div>
  );
}
