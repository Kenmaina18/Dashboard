import * as React from "react";

function Row({ row }) {
  const [open, setOpen] = React.useState(false);
  const [payments, setPayments] = React.useState([]);
  const [loadingPayments, setLoadingPayments] = React.useState(false);

  const fetchPayments = async () => {
    if (!open) {
      setLoadingPayments(true);
      try {
        const response = await fetch(
          `https://sandbox.erp.optiven.co.ke/api/finance/Commission-history?lead_file_id=${row.lead_file}`
        );
        if (!response.ok) throw new Error("Failed to fetch payments");
        const data = await response.json();
        setPayments(data);
      } catch (error) {
        console.error("Error fetching payments:", error);
        setPayments([]);
      } finally {
        setLoadingPayments(false);
      }
    }
    setOpen(!open);
  };

  return (
    <>
      <tr className="main-row">
        <td style={{ width: "50px", padding: "0 10px", textAlign: "center" }}>
          <button
            aria-label="expand row"
            onClick={fetchPayments}
            disabled={loadingPayments}
            className={`expand-btn ${open ? "rotate" : ""}`}
          >
            ▼
          </button>
        </td>
        <th scope="row" style={{ fontWeight: "600" }}>
          {row.lead_file}
        </th>
        <td align="right">{row.marketer}</td>
        <td align="right">{row.plot_number}</td>
        <td align="right">KES {Number(row.purchase_price).toLocaleString()}</td>
        <td align="right">KES {Number(row.total_paid).toLocaleString()}</td>
        <td align="right">{row.percentage}%</td>
      </tr>
      {open && (
        <tr>
          <td colSpan={7} style={{ padding: 0 }}>
            <div style={{ padding: "15px", backgroundColor: "#f7fafc" }}>
              <h6
                style={{
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#2d3748",
                  marginBottom: "10px",
                }}
              >
                Payments
              </h6>
              {loadingPayments ? (
                <p style={{ fontSize: "13px", color: "#718096" }}>
                  Loading payments...
                </p>
              ) : payments.length === 0 ? (
                <p style={{ fontSize: "13px", color: "#718096" }}>
                  No payments found.
                </p>
              ) : (
                <table
                  className="history-table"
                  aria-label="payments"
                  style={{ width: "100%" }}
                >
                  <thead>
                    <tr>
                      <th align="right">Total Paid (KES)</th>
                      <th align="right">Plot Number</th>
                      <th align="right">Paid Status</th>
                      <th align="right">Current Amount</th>
                      <th align="right">Prev Amount</th>
                      <th align="right">Percentage</th>
                      <th align="right">Comm Qualifies</th>
                      <th align="right">Date Recorded</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((payment, index) => (
                      <tr key={index}>
                        <td align="right">
                          KES {Number(payment.total_paid).toLocaleString()}
                        </td>
                        <td align="right">{payment.plot_number}</td>
                        <td align="right">{payment.paid_status}</td>
                        <td align="right">{payment.current_amount}</td>
                        <td align="right">{payment.prev_amount}</td>
                        <td align="right">{payment.percentage}%</td>
                        <td align="right">{payment.commission_qualifies}</td>
                        <td align="right">
                          {new Date(payment.date_recorded).toLocaleString()}
                        </td>
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
  const [searchTerm, setSearchTerm] = React.useState("");

  React.useEffect(() => {
    const fetchLeads = async () => {
      try {
        const response = await fetch(
          "https://sandbox.erp.optiven.co.ke/api/finance/commission"
        );
        if (!response.ok) throw new Error("Failed to fetch leads");
        const data = await response.json();
        setRows(data);
      } catch (error) {
        console.error("Error fetching leads:", error);
        setRows([]);
      } finally {
        setLoading(false);
      }
    };
    fetchLeads();
  }, []);

  const filteredRows = rows.filter(
    (row) =>
      row.marketer?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.plot_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.lead_file?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div
        style={{
          marginBottom: "1rem",
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <input
          type="text"
          placeholder="Search by Marketer, Plot No, or Lead ID"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: "10px 14px",
            borderRadius: "6px",
            border: "1px solid #cbd5e0",
            width: "300px",
            fontSize: "14px",
          }}
        />
      </div>

      <div
        style={{
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          borderRadius: "10px",
          backgroundColor: "#fff",
          maxWidth: "100%",
          margin: "0 auto",
          overflowX: "auto",
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontFamily: "Inter, sans-serif",
          }}
        >
          <thead>
            <tr className="header-row">
              <th style={{ textAlign: "center", width: "50px" }}></th>
              <th style={{ textAlign: "left" }}>Lead ID</th>
              <th style={{ textAlign: "right" }}>Marketer</th>
              <th style={{ textAlign: "right" }}>Plot No</th>
              <th style={{ textAlign: "right" }}>Purchase Price</th>
              <th style={{ textAlign: "right" }}>Total Paid</th>
              <th style={{ textAlign: "right" }}>Paid (%)</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={7}
                  style={{
                    padding: "16px",
                    textAlign: "center",
                    color: "#718096",
                  }}
                >
                  Loading leads...
                </td>
              </tr>
            ) : filteredRows.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  style={{
                    padding: "16px",
                    textAlign: "center",
                    color: "#718096",
                  }}
                >
                  No matching leads found.
                </td>
              </tr>
            ) : (
              filteredRows.map((row) => <Row key={row.id} row={row} />)
            )}
          </tbody>
        </table>
      </div>

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

        .main-row td {
          padding: 16px;
          border-bottom: 1px solid #e2e8f0;
          font-size: 14px;
          color: #4a5568;
          text-align: right; /* consistent */
        }
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
          color: #2d3748;
          border-bottom: 1px solid #e2e8f0;
        }

        .expand-btn {
          transition: transform 0.25s ease;
          font-size: 18px;
          background: none;
          border: none;
          padding: 0;
        }

        .expand-btn.rotate {
          transform: rotate(180deg);
        }

        @media (max-width: 768px) {
          table {
            display: block;
            overflow-x: auto;
            white-space: nowrap;
          }

          .main-row th,
          .main-row td,
          .header-row th,
          .history-table th,
          .history-table td {
            min-width: 100px;
            padding: 12px;
          }
        }
      `}</style>
    </>
  );
}
