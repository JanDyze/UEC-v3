import { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Text } from '../components/ui/Text';
import { Modal } from '../components/ui/Modal';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { styles } from '../styles/global';
import clsx from 'clsx';

const AddMemberForm = ({ formData, setFormData, onSubmit }) => {
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Text variant="small" color="secondary" className="mb-1">
            First Name
          </Text>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
            className={styles.input.base}
          />
        </div>
        <div>
          <Text variant="small" color="secondary" className="mb-1">
            Last Name
          </Text>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
            className={styles.input.base}
          />
        </div>
      </div>

      <div>
        <Text variant="small" color="secondary" className="mb-1">
          Email
        </Text>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={styles.input.base}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Text variant="small" color="secondary" className="mb-1">
            Phone
          </Text>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className={styles.input.base}
          />
        </div>
        <div>
          <Text variant="small" color="secondary" className="mb-1">
            Birthday
          </Text>
          <input
            type="date"
            name="birthday"
            value={formData.birthday}
            onChange={handleChange}
            className={styles.input.base}
          />
        </div>
      </div>

      <div>
        <Text variant="small" color="secondary" className="mb-1">
          Address
        </Text>
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          className={styles.input.base}
        />
      </div>
import { Text } from '../components/ui/Text';
    </form>
  );
};

const Members = () => {
  const [members, setMembers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState('table');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    birthday: '',
    address: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/members');
      setMembers(res.data);
    } catch (err) {
      setError('Failed to fetch members');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await axios.post('/api/members', formData);
      setSuccess('Member added successfully!');
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        birthday: '',
        address: ''
      });
      setIsModalOpen(false);
      fetchMembers();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add member');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this member?')) {
      try {
        setLoading(true);
        await axios.delete(`/api/members/${id}`);
        setSuccess('Member deleted successfully!');
        fetchMembers();
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to delete member');
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading && !members.length) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className={styles.layout.container}>
      <div className={clsx(styles.layout.flex, 'justify-between', styles.layout.section)}>
        <div className={clsx(styles.layout.flex, 'gap-4')}>
          <Text variant="h2">Members</Text>
          <div className={clsx(styles.layout.flex, 'bg-neutral-bg rounded-lg p-1')}>
            <Button
              size="sm"
              variant={viewMode === 'table' ? 'primary' : 'secondary'}
              onClick={() => setViewMode('table')}
            >
              Table
            </Button>
            <Button
              size="sm"
              variant={viewMode === 'card' ? 'primary' : 'secondary'}
              onClick={() => setViewMode('card')}
            >
              Cards
            </Button>
          </div>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          Add Member
        </Button>
      </div>

      {(success || error) && (
        <div 
          className={clsx(
            'mb-4 p-3 rounded-lg flex items-center justify-between',
            success ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'
          )}
        >
          <Text color={success ? 'success' : 'danger'}>
            {success || error}
          </Text>
          {success && (
            <button 
              onClick={() => setSuccess('')}
              className="text-sm hover:opacity-80"
            >
              ✕
            </button>
          )}
        </div>
      )}

      {viewMode === 'table' ? (
        <div className={styles.table.wrapper}>
          <table className="w-full">
            <thead className={styles.table.header}>
              <tr>
                <th className={styles.table.headerCell}>Name</th>
                <th className={styles.table.headerCell}>Email</th>
                <th className={styles.table.headerCell}>Phone</th>
                <th className={styles.table.headerCell}>Birthday</th>
                <th className={styles.table.headerCell}>Address</th>
                <th className={styles.table.headerCell}></th>
              </tr>
            </thead>
            <tbody>
              {members.map((member) => (
                <tr key={member._id} className={styles.table.row}>
                  <td className={styles.table.cell}>
                    <Text>{member.firstName} {member.lastName}</Text>
                  </td>
                  <td className={styles.table.cell}>
                    <Text color="secondary">{member.email || '-'}</Text>
                  </td>
                  <td className={styles.table.cell}>
                    <Text color="secondary">{member.phone || '-'}</Text>
                  </td>
                  <td className={styles.table.cell}>
                    <Text color="secondary">
                      {member.birthday 
                        ? new Date(member.birthday).toLocaleDateString()
                        : '-'
                      }
                    </Text>
                  </td>
                  <td className={styles.table.cell}>
                    <Text color="secondary">{member.address || '-'}</Text>
                  </td>
                  <td className={styles.table.cell}>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(member._id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {members.map((member) => (
            <Card key={member._id}>
              <div className="flex justify-between items-start mb-4">
                <Text variant="h3">
                  {member.firstName} {member.lastName}
                </Text>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(member._id)}
                >
                  Delete
                </Button>
              </div>
              <div className="space-y-2">
                <Text color="secondary">
                  <span className="font-medium">Email:</span> {member.email || '-'}
                </Text>
                <Text color="secondary">
                  <span className="font-medium">Phone:</span> {member.phone || '-'}
                </Text>
                <Text color="secondary">
                  <span className="font-medium">Birthday:</span>{' '}
                  {member.birthday 
                    ? new Date(member.birthday).toLocaleDateString()
                    : '-'
                  }
                </Text>
                <Text color="secondary">
                  <span className="font-medium">Address:</span> {member.address || '-'}
                </Text>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Member"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              loading={loading}
            >
              Add Member
            </Button>
          </>
        }
      >
        <AddMemberForm
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleSubmit}
        />
      </Modal>
    </div>
  );
};

export default Members;