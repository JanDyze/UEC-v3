import { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Text } from '../components/ui/Text';
import { Modal } from '../components/ui/Modal';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { styles } from '../styles/global';
import clsx from 'clsx';
import { ConfirmationModal } from '../components/ui/ConfirmationModal';
import { useToast } from '../components/ui/Toast/ToastContext';

const AddMemberForm = ({ formData, setFormData, onSubmit }) => {
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-2">
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
            className={styles.input.base }
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
    </form>
  );
};

const Members = () => {
  const { showToast } = useToast();
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
  const [loading, setLoading] = useState(false);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    memberId: null,
    memberName: ''
  });

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/members');
      setMembers(res.data);
    } catch (err) {
      showToast('Failed to fetch members', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await axios.post('/api/members', formData);
      showToast('Member added successfully!');
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
      showToast(err.response?.data?.error || 'Failed to add member', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/members/${deleteModal.memberId}`);
      showToast(`${deleteModal.memberName} and their attendance records have been deleted successfully`);
      setDeleteModal({ isOpen: false, memberId: null, memberName: '' });
      fetchMembers();
    } catch (err) {
      showToast(err.response?.data?.error || 'Failed to delete member', 'error');
    } finally {
      setLoading(false);
    }
  };

  const openDeleteModal = (member) => {
    setDeleteModal({
      isOpen: true,
      memberId: member._id,
      memberName: `${member.firstName} ${member.lastName}`
    });
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
                      onClick={() => openDeleteModal(member)}
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
                  onClick={() => openDeleteModal(member)}
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

      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, memberId: null, memberName: '' })}
        onConfirm={handleDelete}
        title="Delete Member"
        message={
          <>
            <Text color="secondary" className="mb-2">
              Are you sure you want to delete {deleteModal.memberName}?
            </Text>
            <Text color="danger" variant="small">
              This will also delete all attendance records for this member. This action cannot be undone.
            </Text>
          </>
        }
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        loading={loading}
      />
    </div>
  );
};

export default Members;