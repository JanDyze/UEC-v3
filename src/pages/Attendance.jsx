import { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Text } from '../components/ui/Text';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { styles } from '../styles/global';
import clsx from 'clsx';

const AttendanceStatus = {
  PRESENT: 'present',
  ABSENT: 'absent',
  LATE: 'late'
};

const StatusButton = ({ status, selected, onClick }) => (
  <Button
    size="sm"
    variant={selected ? status === 'present' ? 'success' : status === 'late' ? 'warning' : 'danger' : 'secondary'}
    onClick={() => onClick(status)}
  >
    {status}
  </Button>
);

const StatsCard = ({ label, value, variant }) => (
  <Card variant={variant}>
    <Text variant="small" color={variant === 'white' ? 'secondary' : variant}>
      {label}
    </Text>
    <Text variant="h2" color={variant === 'white' ? 'default' : variant}>
      {value}
    </Text>
  </Card>
);

const Attendance = () => {
  const [members, setMembers] = useState([]);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendance, setAttendance] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchMembers();
    fetchAttendance();
  }, [date]);

  const fetchMembers = async () => {
    try {
      const res = await axios.get('/api/members');
      setMembers(res.data);
    } catch (err) {
      setError('Failed to fetch members');
    }
  };

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/attendance?date=${date}`);
      setAttendance(res.data);
      setIsEditing(res.data.length > 0);
      setError('');
    } catch (err) {
      setError('Failed to fetch attendance');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const records = members.map(member => {
        const existingAttendance = attendance.find(a => a.memberId._id === member._id);
        return {
          memberId: member._id,
          status: existingAttendance?.status || AttendanceStatus.ABSENT,
          notes: existingAttendance?.notes || ''
        };
      });

      await axios.post('/api/attendance/bulk', {
        date,
        records
      });

      setSuccess(isEditing ? 'Attendance updated successfully' : 'Attendance recorded successfully');
      setError('');
      await fetchAttendance();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save attendance');
      setSuccess('');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (memberId, status) => {
    try {
      const existingRecord = attendance.find(a => a.memberId._id === memberId);
      
      setAttendance(prev => {
        if (existingRecord) {
          // If clicking the same status, keep it (no more toggle off)
          return prev.map(a => 
            a.memberId._id === memberId ? { ...a, status } : a
          );
        }
        return [...prev, { 
          memberId: { _id: memberId }, 
          status,
          date: new Date(date)
        }];
      });
    } catch (err) {
      setError('Failed to update attendance status');
    }
  };

  const getAttendanceStats = () => {
    const stats = {
      total: members.length,
      present: 0,
      late: 0,
      absent: 0
    };

    members.forEach(member => {
      const status = attendance.find(a => a.memberId._id === member._id)?.status || AttendanceStatus.ABSENT;
      stats[status]++;
    });

    return stats;
  };

  const stats = getAttendanceStats();

  return (
    <div className={styles.layout.container}>
      <div className={clsx(styles.layout.flex, 'justify-between', styles.layout.section)}>
        <div className={clsx(styles.layout.flex, 'gap-4')}>
          <Text variant="h2">Attendance</Text>
          {isEditing && (
            <span className="text-sm px-2 py-1 bg-warning/10 text-warning rounded-md">
              Editing Existing Records
            </span>
          )}
        </div>
        <div className={clsx(styles.layout.flex, 'gap-4')}>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={styles.input.base}
          />
          <Button
            variant={isEditing ? 'warning' : 'primary'}
            loading={loading}
            onClick={handleSubmit}
          >
            {isEditing ? 'Update Attendance' : 'Save Attendance'}
          </Button>
        </div>
      </div>

      {(success || error) && (
        <div 
          className={`mb-4 p-3 rounded-lg flex items-center justify-between ${
            success ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'
          }`}
        >
          <span>{success || error}</span>
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

      <div className={clsx(styles.layout.grid, 'md:grid-cols-4', styles.layout.section)}>
        <StatsCard label="Total Members" value={stats.total} variant="white" />
        <StatsCard label="Present" value={stats.present} variant="success" />
        <StatsCard label="Late" value={stats.late} variant="warning" />
        <StatsCard label="Absent" value={stats.absent} variant="danger" />
      </div>

      {loading && !attendance.length ? (
        <div className="text-center py-8 text-neutral-text-secondary">
          Loading attendance records...
        </div>
      ) : (
        <>
          <div className={styles.table.wrapper}>
            <table className="w-full">
              <thead className={styles.table.header}>
                <tr>
                  <th className={styles.table.headerCell}>Name</th>
                  <th className={clsx(styles.table.headerCell, 'text-center')}>Status</th>
                </tr>
              </thead>
              <tbody>
                {members.map((member) => (
                  <tr key={member._id} className={styles.table.row}>
                    <td className={styles.table.cell}>
                      <Text>{member.firstName} {member.lastName}</Text>
                    </td>
                    <td className={styles.table.cell}>
                      <div className="flex justify-center gap-2">
                        {Object.values(AttendanceStatus).map((status) => (
                          <StatusButton
                            key={status}
                            status={status}
                            selected={attendance.find(a => 
                              a.memberId._id === member._id
                            )?.status === status}
                            onClick={() => handleStatusChange(member._id, status)}
                          />
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default Attendance; 