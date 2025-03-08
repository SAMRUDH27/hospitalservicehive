import React, { useState } from 'react';
import { useHive } from '../contexts/HiveContext';
import toast from 'react-hot-toast';

const donateStyles = {
  container: {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '3rem 1rem'
  },
  header: {
    textAlign: 'center',
    marginBottom: '2rem'
  },
  title: {
    fontSize: '2.25rem',
    fontWeight: '800',
    color: '#111827',
    marginBottom: '1rem'
  },
  subtitle: {
    fontSize: '1.25rem',
    color: '#6b7280',
    maxWidth: '42rem',
    margin: '0 auto'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '2rem',
    marginTop: '3rem'
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '0.5rem',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
    overflow: 'hidden',
    cursor: 'pointer',
    transition: 'all 0.2s',
    padding: '1.5rem'
  },
  cardSelected: {
    boxShadow: '0 0 0 2px #3b82f6'
  },
  cardTitle: {
    fontSize: '1.125rem',
    fontWeight: '500',
    color: '#111827',
    marginBottom: '0.5rem'
  },
  cardDescription: {
    fontSize: '0.875rem',
    color: '#6b7280',
    marginBottom: '1rem'
  },
  progressContainer: {
    marginTop: '1rem'
  },
  progressLabel: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.5rem'
  },
  progressBadge: {
    fontSize: '0.75rem',
    fontWeight: '600',
    backgroundColor: '#dbeafe',
    color: '#2563eb',
    padding: '0.25rem 0.5rem',
    borderRadius: '9999px'
  },
  progressBar: {
    height: '0.5rem',
    backgroundColor: '#dbeafe',
    borderRadius: '0.25rem',
    overflow: 'hidden',
    marginBottom: '1rem'
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3b82f6'
  },
  progressText: {
    fontSize: '0.875rem',
    fontWeight: '500',
    color: '#6b7280'
  },
  form: {
    maxWidth: '32rem',
    margin: '3rem auto 0',
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '0.5rem',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
  },
  formGroup: {
    marginBottom: '1.5rem'
  },
  label: {
    display: 'block',
    fontSize: '0.875rem',
    fontWeight: '500',
    color: '#374151',
    marginBottom: '0.5rem'
  },
  input: {
    width: '100%',
    padding: '0.5rem 0.75rem',
    borderRadius: '0.375rem',
    border: '1px solid #d1d5db',
    fontSize: '0.875rem'
  },
  textarea: {
    width: '100%',
    padding: '0.5rem 0.75rem',
    borderRadius: '0.375rem',
    border: '1px solid #d1d5db',
    fontSize: '0.875rem',
    minHeight: '6rem'
  },
  button: {
    width: '100%',
    backgroundColor: '#2563eb',
    color: 'white',
    padding: '0.75rem 1rem',
    borderRadius: '0.375rem',
    fontSize: '0.875rem',
    fontWeight: '500',
    border: 'none',
    cursor: 'pointer'
  },
  message: {
    textAlign: 'center',
    fontSize: '1.125rem',
    color: '#6b7280',
    marginTop: '3rem'
  }
};

const HOSPITAL_REQUIREMENTS = [
  {
    id: 1,
    title: 'Medical Equipment Fund',
    description: 'Support the purchase of essential medical equipment for our hospital.',
    target: 1000,
    raised: 450,
    account: 'hospital.fund'
  },
  {
    id: 2,
    title: 'Patient Care Support',
    description: 'Help provide quality care for patients who cannot afford treatment.',
    target: 2000,
    raised: 890,
    account: 'patient.care'
  },
  {
    id: 3,
    title: 'Emergency Response Unit',
    description: 'Support our emergency response team with necessary resources.',
    target: 1500,
    raised: 675,
    account: 'emergency.unit'
  }
];

function Donate() {
  const [selectedFund, setSelectedFund] = useState(null);
  const [amount, setAmount] = useState('');
  const [memo, setMemo] = useState('');
  const { transfer, username } = useHive();

  const handleDonate = async (e) => {
    e.preventDefault();
    if (!selectedFund) {
      toast.error('Please select a fund to donate to');
      return;
    }

    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    // Format amount to have exactly 3 decimal places
    const formattedAmount = parseFloat(amount).toFixed(3);

    try {
      await transfer(selectedFund.account, formattedAmount, memo || 'Hospital donation');
      toast.success('Thank you for your donation!');
      setAmount('');
      setMemo('');
      setSelectedFund(null);
    } catch (error) {
      toast.error('Failed to process donation: ' + error.message);
    }
  };

  return (
    <div style={donateStyles.container}>
      <div style={donateStyles.header}>
        <h2 style={donateStyles.title}>Support Our Hospital</h2>
        <p style={donateStyles.subtitle}>
          Your donations help us provide better healthcare services to those in need.
        </p>
      </div>

      <div style={donateStyles.grid}>
        {HOSPITAL_REQUIREMENTS.map((fund) => (
          <div
            key={fund.id}
            style={{
              ...donateStyles.card,
              ...(selectedFund?.id === fund.id ? donateStyles.cardSelected : {})
            }}
            onClick={() => setSelectedFund(fund)}
          >
            <h3 style={donateStyles.cardTitle}>{fund.title}</h3>
            <p style={donateStyles.cardDescription}>{fund.description}</p>
            <div style={donateStyles.progressContainer}>
              <div style={donateStyles.progressLabel}>
                <span style={donateStyles.progressBadge}>Progress</span>
                <span style={{ ...donateStyles.progressBadge, backgroundColor: 'transparent' }}>
                  {((fund.raised / fund.target) * 100).toFixed(1)}%
                </span>
              </div>
              <div style={donateStyles.progressBar}>
                <div
                  style={{
                    ...donateStyles.progressFill,
                    width: `${(fund.raised / fund.target) * 100}%`
                  }}
                />
              </div>
              <p style={donateStyles.progressText}>
                {fund.raised} HIVE raised of {fund.target} HIVE goal
              </p>
            </div>
          </div>
        ))}
      </div>

      {username ? (
        <form onSubmit={handleDonate} style={donateStyles.form}>
          <div style={donateStyles.formGroup}>
            <label htmlFor="amount" style={donateStyles.label}>
              Donation Amount (HIVE)
            </label>
            <input
              type="number"
              step="0.001"
              min="0.001"
              name="amount"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              style={donateStyles.input}
              placeholder="0.000"
            />
          </div>

          <div style={donateStyles.formGroup}>
            <label htmlFor="memo" style={donateStyles.label}>
              Message (Optional)
            </label>
            <textarea
              id="memo"
              name="memo"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              style={donateStyles.textarea}
              placeholder="Add a message to your donation"
            />
          </div>

          <button type="submit" style={donateStyles.button}>
            Donate Now
          </button>
        </form>
      ) : (
        <div style={donateStyles.message}>
          Please connect your Hive account to make a donation.
        </div>
      )}
    </div>
  );
}

export default Donate; 