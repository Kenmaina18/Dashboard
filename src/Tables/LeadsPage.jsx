import * as React from 'react';

function Row(props) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);
  const [payments, setPayments] = React.useState([]);
  const [loadingPayments, setLoadingPayments] = React.useState(false);

  const fetchPayments = async () => {
    if (!open) {
      setLoadingPayments(true);
      try {
        const response = await fetch(``);
        if (!response.ok) throw new Error('Failed to fetch payments');
        const data = await response.json();
        setPayments(data);
      } catch (error) {
        console.error('Error fetching payments:', error);
        setPayments([]); // Fallback to empty array on error
      } finally {
        setLoadingPayments(false);
      }
    }
    setOpen(!open);
  };

  return (
    <>
      <tr className="main-row">
        <td style={{ width: '40px', padding: '0 10px' }}>
          <button
            aria-label="expand row"
            onClick={fetchPayments}
            disabled={loadingPayments}
            style={{
              background: 'none',
              border: 'none',
              cursor: loadingPayments ? 'not-allowed' : 'pointer',
              fontSize: '16px',
              color: loadingPayments ? '#a0aec0' : '#2d3748',
              padding: '8px',
              transition: 'transform 0.2s ease',
              transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            }}
          >
            ▼
          </button>
        </td>
        <th scope="row" style={{ fontWeight: '600' }}>{row.id}</th>
        <td align="right">{row.plot_number}</td>
        <td align="right">${row.purchase_price.toFixed(2)}</td>
        <td align="right">{row.percentage}%</td>
      </tr>
      {open && (
        <tr>
          <td colSpan={5} style={{ padding: 0 }}>
            <div style={{ padding: '15px', backgroundColor: '#f7fafc' }}>
              <h6 style={{ fontSize: '14px', fontWeight: '600', color: '#2d3748', marginBottom: '10px' }}>
                Payments
              </h6>
              {loadingPayments ? (
                <p style={{ fontSize: '13px', color: '#718096' }}>Loading payments...</p>
              ) : payments.length === 0 ? (
                <p style={{ fontSize: '13px', color: '#718096' }}>No payments found.</p>
              ) : (
                <table className="history-table" aria-label="payments">
                  <thead>
                    <tr>
                      <th style={{ textAlign: 'left' }}>Payment ID</th>
                      <th align="right">Total Paid ($)</th>
                      <th align="right">Paid Status</th>
                      <th align="right">Date Recorded</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((payment, index) => (
                      <tr key={index}>
                        <th scope="row" style={{ fontWeight: '500' }}>{payment.id}</th>
                        <td align="right">${payment.total_paid.toFixed(2)}</td>
                        <td align="right">{payment.paid_status}</td>
                        <td align="right">{payment.date_recorded}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

export default function CollapsibleTable() {
  const [rows, setRows] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchLeads = async () => {
      try {
        const response = await fetch('');
        if (!response.ok) throw new Error('Failed to fetch leads');
        const data = await response.json();
        setRows(data);
      } catch (error) {
        console.error('Error fetching leads:', error);
        setRows([]); // Fallback to empty array on error
      } finally {
        setLoading(false);
      }
    };

    fetchLeads();
  }, []);

  return (
    <>
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
          aria-label="collapsible table"
        >
          <thead>
            <tr className="header-row">
              <th style={{ width: '40px' }}></th>
              <th style={{ textAlign: 'left' }}>Lead ID</th>
              <th align="right">Plot No</th>
              <th align="right">Purchase Price ($)</th>
              <th align="right">Percentage Paid (%)</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} style={{ padding: '16px', textAlign: 'center', color: '#718096' }}>
                  Loading leads...
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: '16px', textAlign: 'center', color: '#718096' }}>
                  No leads found.
                </td>
              </tr>
            ) : (
              rows.map((row) => <Row key={row.id} row={row} />)
            )}
          </tbody>
        </table>
      </div>

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

        .history-table {
          width: 100%;
          border-collapse: collapse;
        }

        .history-table th,
        .history-table td {
          padding: 12px;
          font-size: 13px;
          color: #718096;
          border-bottom: 1px solid #edf2f7;
        }

        .history-table thead th {
          font-weight: 600;
          color: #4a5568;
          border-bottom: 1px solid #e2e8f0;
        }

        .history-table tbody tr:last-child {
          border-bottom: none;
        }

        .history-table tbody tr:hover {
          background-color: #edf2f7;
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

          .history-table th,
          .history-table td {
            padding: 10px;
          }
        }
      `}</style>
    </>
  );
}