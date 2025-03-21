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
            <label style={{ display: 'block', fontSize: '14px', color: '#4a5568', marginBottom: '5px' }}>Start Date</label>
            <input
              type="datetime-local"
              name="start_date"
              value={formData.start_date ? formData.start_date.slice(0, 16) : ''}
              onChange={handleChange}
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #e2e8f0' }}
              required
            />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label style={{ display: 'block', fontSize: '14px', color: '#4a5568', marginBottom: '5px' }}>End Date</label>
            <input
              type="datetime-local"
              name="end_date"
              value={formData.end_date ? formData.end_date.slice(0, 16) : ''}
              onChange={handleChange}
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #e2e8f0' }}
              required
            />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label style={{ display: 'block', fontSize: '14px', color: '#4a5568', marginBottom: '5px' }}>Status</label>
            <select
              name="status"
              value={formData.status || ''}
              onChange={handleChange}
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #e2e8f0' }}
              required
            >
              <option value="">Select Status</option>
              <option value="Opened">Opened</option>
              <option value="Closed">Closed</option>
            </select>
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
      id: periods.length ? Math.max(...periods.map((p) => p.id)) + 1 : 1, // Generate a new ID
      start_date: new Date(formData.start_date).toISOString(),
      end_date: new Date(formData.end_date).toISOString(),
      status: formData.status,
    };
    setPeriods((prev) => [...prev, newPeriod]);
  };

  const handleUpdatePeriod = (periodId, formData) => {
    setPeriods((prev) =>
      prev.map((period) =>
        period.id === periodId
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

  const handleDeletePeriod = (periodId) => {
    if (window.confirm('Are you sure you want to delete this commission period?')) {
      setPeriods((prev) => prev.filter((period) => period.id !== periodId));
    }
  };

  return (
    <>
      <div style={{ marginBottom: '15px' }}>
        <button
          onClick={() => setAddModalOpen(true)}
          style={{ padding: '8px 16px', backgroundColor: '#2d3748', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Add Commission Period
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
          aria-label="commission periods table"
        >
          <thead>
            <tr className="header-row">
              <th style={{ textAlign: 'left' }}>Period ID</th>
              <th align="right">Start Date</th>
              <th align="right">End Date</th>
              <th align="right">Status</th>
              <th align="right">Actions</th>
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
              periods.map((period) => (
                <tr key={period.id} className="main-row">
                  <th scope="row" style={{ fontWeight: '600' }}>{period.id}</th>
                  <td align="right">{new Date(period.start_date).toLocaleString()}</td>
                  <td align="right">{new Date(period.end_date).toLocaleString()}</td>
                  <td align="right">{period.status}</td>
                  <td align="right">
                    <button
                      onClick={() => setEditModalOpen(period)}
                      style={{ background: 'none', border: 'none', color: '#4299e1', cursor: 'pointer', marginRight: '10px' }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeletePeriod(period.id)}
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
        onSubmit={handleAddPeriod}
        title="Add Commission Period"
        initialData={{}}
      />
      <Modal
        isOpen={!!isEditModalOpen}
        onClose={() => setEditModalOpen(null)}
        onSubmit={(formData) => handleUpdatePeriod(isEditModalOpen.id, formData)}
        title="Edit Commission Period"
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