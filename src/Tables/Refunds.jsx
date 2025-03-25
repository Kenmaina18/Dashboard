import React from 'react';

const Refunds = () => {
    const [refunds, setRefunds] = React.useState([]);

    React.useEffect(() => {
        fetch('http://localhost:8000/api/finance/refund_transaction')
            .then(response => response.json())
            .then(data => setRefunds(data))
            .catch(error => console.error('Error fetching refunds:', error));
    }, []);

    return (
        <div className="refunds-container">
         
            <table className="refunds-table">
                <thead>
                    <tr>
                        <th>Marketer</th>
                        <th>Lead File</th>
                        <th>Previous Total Paid</th>
                        <th>New Total Paid</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    {refunds.map(refund => (
                        <tr key={refund.id}>
                            <td>{refund.marketer}</td>
                            <td>{refund.lead_file}</td>
                            <td>{Number(refund.previous_total_paid).toLocaleString()}</td>
                            <td>{Number(refund.new_total_paid).toLocaleString}</td>
                            <td>{refund.recorded_at}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Refunds;