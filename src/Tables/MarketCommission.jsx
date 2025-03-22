import * as React from 'react';

export default function MarketerCommissionTable() {
  const [commissions, setCommissions] = React.useState([]);
  const [periods, setPeriods] = React.useState([]);
  const [selectedPeriod, setSelectedPeriod] = React.useState('all');
  const [openPeriod, setOpenPeriod] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  const fetchOpenPeriod = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/finance/commission_period/open');
      if (res.ok) {
        const data = await res.json();
        setOpenPeriod(data); // e.g., { period_start: "2025-03-01", period_end: "2025-03-31" }
      }
    } catch (err) {
      console.error('Error fetching open commission period:', err);
    }
  };

  const fetchCommissions = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/finance/marketers_commission');
      const data = await response.json();
      setCommissions(data);

      const uniquePeriods = [
        ...new Map(data.map(item => [`${item.period_start}_${item.period_end}`, {
          label: `${item.period_start} to ${item.period_end}`,
          value: `${item.period_start}_${item.period_end}`,
        }])).values()
      ];

      setPeriods(uniquePeriods);
    } catch (error) {
      console.error('Error fetching marketer commissions:', error);
      setCommissions([]);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchOpenPeriod();
    fetchCommissions();
  }, []);

  // Add the open period to periods list if not already present
  const combinedPeriods = React.useMemo(() => {
    const all = [...periods];
    if (openPeriod) {
      const openValue = `${openPeriod.period_start}_${openPeriod.period_end}`;
      const exists = all.some(p => p.value === openValue);
      if (!exists) {
        all.unshift({
          label: `${openPeriod.period_start} to ${openPeriod.period_end} (Current)`,
          value: openValue,
        });
      }
    }
    return all;
  }, [periods, openPeriod]);

  const filteredCommissions =
    selectedPeriod === 'all'
      ? commissions
      : commissions.filter(c => `${c.period_start}_${c.period_end}` === selectedPeriod);

  return (
    <div style={{ padding: '20px', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <label style={{ fontSize: '14px', fontWeight: 500 }}>Filter by Period:</label>
        <select
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
          style={{
            padding: '8px 12px',
            borderRadius: '6px',
            border: '1px solid #cbd5e0',
            fontSize: '14px',
            minWidth: '260px'
          }}
        >
          <option value="all">All Periods</option>
          {combinedPeriods.map((period) => (
            <option key={period.value} value={period.value}>
              {period.label}
            </option>
          ))}
        </select>
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
          minWidth: '800px'
        }}>
          <thead className="header-row">
            <tr>
              <th style={{ textAlign: 'left', padding: '14px' }}>Marketer</th>
              <th style={{ textAlign: 'right', padding: '14px' }}>Total Amount (KES)</th>
              <th style={{ textAlign: 'right', padding: '14px' }}>Commission %</th>
              <th style={{ textAlign: 'right', padding: '14px' }}>Commission Earned</th>
              <th style={{ textAlign: 'right', padding: '14px' }}>Start</th>
              <th style={{ textAlign: 'right', padding: '14px' }}>End</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} style={{ padding: '16px', textAlign: 'center' }}>Loading...</td></tr>
            ) : filteredCommissions.length === 0 ? (
              <tr><td colSpan={7} style={{ padding: '16px', textAlign: 'center' }}>No commissions found.</td></tr>
            ) : (
              filteredCommissions.map(c => (
                <tr key={c.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '12px 14px', fontWeight: 500 }}>{c.marketer}</td>
                  <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                    KES {Number(c.total_commissionable_amount).toLocaleString()}
                  </td>
                  <td style={{ padding: '12px 14px', textAlign: 'right' }}>{c.commission_percentage}%</td>
                  <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                    KES {Number(c.commission_earned).toLocaleString()}
                  </td>
                  
                  <td style={{ padding: '12px 14px', textAlign: 'right' }}>{c.period_start}</td>
                  <td style={{ padding: '12px 14px', textAlign: 'right' }}>{c.period_end}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
