import React from 'react';
import { Receipt, CheckCircle, Clock, X } from 'lucide-react';

const ExpensesTab = ({ expenses, onApprove, onReject }) => {
  return (
    <div className="expenses-view">
      <h3>Expense Management</h3>
      
      <div className="expense-categories">
        <div className="category-filter">
          <button className="filter-tag active">All</button>
          <button className="filter-tag">Marketing</button>
          <button className="filter-tag">Maintenance</button>
          <button className="filter-tag">Utilities</button>
          <button className="filter-tag">Salaries</button>
        </div>
      </div>

      <table className="expenses-table">
        <thead>
          <tr>
            <th>Description</th>
            <th>Category</th>
            <th>Amount</th>
            <th>Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((expense) => (
            <tr key={expense.id} className={`status-${expense.status}`}>
              <td>
                <div className="expense-desc">
                  <Receipt size={14} />
                  {expense.description}
                </div>
              </td>
              <td>
                <span className="category-badge">{expense.category}</span>
              </td>
              <td className="amount">
                AED {expense.amount.toLocaleString()}
              </td>
              <td>{expense.date}</td>
              <td>
                <span className={`status-badge status-${expense.status}`}>
                  {expense.status}
                </span>
              </td>
              <td>
                {expense.status === 'pending' && (
                  <div className="expense-actions">
                    <button
                      className="btn-approve"
                      onClick={() => onApprove(expense.id)}
                      title="Approve expense"
                    >
                      <CheckCircle size={16} />
                    </button>
                    <button
                      className="btn-reject"
                      onClick={() => onReject(expense.id)}
                      title="Reject expense"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ExpensesTab;
