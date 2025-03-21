import * as React from 'react';

export default function MarketerCommissionTable() {
  const [commissions, setCommissions] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  const fetchCommissions = async () => {
    try {
      const response = await fetch('');
      if (!response.ok) throw new Error('Failed to fetch marketer commissions');
      const data = await response.json();
      setCommissions(data);
    } catch (error) {
      console.error('Error fetching marketer commissions:', error);
      setCommissions([]);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchCommissions();
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
          aria-label="marketer commissions table"
        >
          <thead>
            <tr className="header-row">
              <th style={{ textAlign: 'left' }}>ID</th>
              <th style={{ textAlign: 'left' }}>Marketer</th>
              <th align="right">Total Amount (KES)</th>
              <th align="right">Commission %</th>
              <th align="right">Commission Earned (KES)</th>
              <th align="right">Calculated At</th>
              <th align="right">Period Start</th>
              <th align="right">Period End</th>
              <th align="right">Commission Period</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={9} style={{ padding: '16px', textAlign: 'center', color: '#718096' }}>
                  Loading commissions...
                </td>
              </tr>
            ) : commissions.length === 0 ? (
              <tr>
                <td colSpan={9} style={{ padding: '16px', textAlign: 'center', color: '#718096' }}>
                  No commissions found.
                </td>
              </tr>
            ) : (
              commissions.map((commission) => (
                <tr key={commission.id} className="main-row">
                  <th scope="row" style={{ fontWeight: '600' }}>{commission.id}</th>
                  <td style={{ textAlign: 'left' }}>{commission.marketer}</td>
                  <td align="right">KES {commission.total_amount.toFixed(2)}</td>
                  <td align="right">{commission.commission_percentage.toFixed(2)}%</td>
                  <td align="right">KES {commission.commission_earned.toFixed(2)}</td>
                  <td align="right">{new Date(commission.calculated_at).toLocaleString()}</td>
                  <td align="right">{commission.period_start}</td>
                  <td align="right">{commission.period_end}</td>
                  <td align="right">{commission.commission_period}</td>
                </tr>
              ))
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