const TransactionStatus = ({ data }) => {
  return (
    <div className="mt-20">
      <h3 className="font-medium text-lg mb-3">Transaction Status</h3>
      <div className="overflow-x-auto custom-shadow rounded">
        <table className="custom-shadow rounded w-full">
          <thead>
            <tr className="shadow">
              <th className="px-10 py-3 font-normal text-start">Transaction Title</th>
              <th className="px-10 py-3 font-normal text-start">Created</th>
              <th className="px-10 py-3 font-normal text-start">Amount</th>
            </tr>
          </thead>
          <tbody>
            {data.map((txn, idx) => (
              <tr key={idx}>
                <td className="px-10 py-3 text-start">{txn.status || "N/A"}</td>
                <td className="px-10 py-3 text-start">{txn.bank || "N/A"}</td>
                <td className="px-10 py-3 text-start">{txn.price || "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionStatus;
