import { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Text } from '../components/ui/Text';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { styles } from '../styles/global';
import clsx from 'clsx';
import { Toast } from '../components/ui/Toast';
import { useToast } from '../components/ui/Toast/ToastContext';

const AttendanceStatus = {
  PRESENT: 'present',
  ABSENT: 'absent',
  LATE: 'late'
};

const StatusSwitch = ({ status, selected, onClick }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'present': return 'bg-success text-white';
      case 'late': return 'bg-warning text-white';
      case 'absent': return 'bg-danger text-white';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <button
      onClick={() => onClick(status)}
      className={clsx(
        'px-3 py-1.5 text-sm font-medium capitalize',
        'first:rounded-l-lg last:rounded-r-lg',
        'transition-all duration-200',
        'transform hover:scale-105 active:scale-95',
        selected ? [
          getStatusColor(),
          'ring-1',
          'shadow-md',
          status === 'present' && 'ring-success',
          status === 'late' && 'ring-warning',
          status === 'absent' && 'ring-danger',
        ] : [
          'hover:bg-gray-100',
          'text-gray-600',
          'border border-gray-200',
          '-ml-[1px]',
          'hover:z-10',
        ]
      )}
    >
      {status}
    </button>
  );
};

const StatsCard = ({ label, value, variant }) => (
  <Card 
    variant={variant}
    className="p-4 transition-all duration-200 hover:scale-[1.02]"
  >
    <Text variant="small" color={variant === 'white' ? 'secondary' : variant}>
      {label}
    </Text>
    <Text variant="h2" color={variant === 'white' ? 'default' : variant}>
      {value}
    </Text>
  </Card>
);

const Attendance = () => {
  const { showToast } = useToast();
  const [members, setMembers] = useState([]);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [originalAttendance, setOriginalAttendance] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      try {
        const [membersRes, attendanceRes] = await Promise.all([
          axios.get('/api/members'),
          axios.get(`/api/attendance?date=${date}`)
        ]);
        
        if (membersRes.data && Array.isArray(membersRes.data)) {
          setMembers(membersRes.data);
        } else {
          throw new Error('Invalid members data received');
        }
        
        const validAttendance = attendanceRes.data.filter(record => 
          membersRes.data.some(member => member._id === record.memberId._id)
        );

        if (validAttendance.length !== attendanceRes.data.length) {
          console.warn('Some attendance records were for deleted members');
        }

        setAttendance(validAttendance);
        setOriginalAttendance(validAttendance);
        setIsEditing(validAttendance.length > 0);
      } catch (err) {
        showToast('Failed to load attendance data', 'error');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [date]);

  const hasChanges = () => {
    if (attendance.length !== originalAttendance.length) return true;

    return attendance.some(current => {
      const original = originalAttendance.find(
        o => o.memberId._id === current.memberId._id
      );
      return !original || original.status !== current.status;
    });
  };

  const refreshData = () => {
    setDate(date);
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

      setOriginalAttendance(attendance);
      setIsEditing(true);
      showToast(
        isEditing ? 'Attendance updated successfully' : 'Attendance recorded successfully'
      );
    } catch (err) {
      showToast(
        err.response?.data?.error || 'Failed to save attendance',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (memberId, status) => {
    setAttendance(prev => {
      const existingRecord = prev.find(a => a.memberId._id === memberId);
      if (existingRecord) {
        return prev.map(a => 
          a.memberId._id === memberId ? { ...a, status } : a
        );
      }
      const member = members.find(m => m._id === memberId);
      if (!member) return prev;

      return [...prev, { 
        memberId: { 
          _id: memberId,
          firstName: member.firstName,
          lastName: member.lastName
        }, 
        status,
        date: new Date(date)
      }];
    });
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

  if (loading && !members.length) {
    return (
      <div className={clsx(styles.layout.container, styles.layout.flexCenter, 'min-h-[50vh] flex-col gap-4')}>
        <LoadingSpinner size="lg" />
        <Text color="secondary">Loading attendance data...</Text>
      </div>
    );
  }

  if (!loading && !members.length) {
    return (
      <div className={styles.layout.container}>
        <div className={clsx(styles.layout.flexCenter, 'min-h-[50vh] flex-col gap-4')}>
          <div className="text-center">
            <Text variant="h3" color="secondary" className="mb-2">No Members Found</Text>
            <Text color="secondary" className="mb-4">Add members first to track attendance</Text>
            <Button variant="primary" onClick={() => window.location.href = '/members'}>
              Go to Members
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.layout.container}>
      <div className={clsx(styles.layout.flexBetween, styles.layout.section, 'flex-col sm:flex-row gap-4')}>
        <div className={clsx(styles.layout.flex, 'gap-4 items-center')}>
          <Text variant="h2">Attendance</Text>
          {isEditing && (
            <span className={clsx(
              styles.status.warning, 
              styles.utils.rounded, 
              'px-3 py-1 text-sm font-medium animate-pulse'
            )}>
              Editing Mode
            </span>
          )}
        </div>
        <div className={clsx(styles.layout.flex, 'gap-4 w-full sm:w-auto')}>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={clsx(styles.input.base, 'min-w-[200px]')}
          />
          <Button
            variant={isEditing ? 'warning' : 'primary'}
            loading={loading}
            onClick={handleSubmit}
            disabled={isEditing && !hasChanges()}
            className={clsx(
              "whitespace-nowrap",
              "transition-all duration-200",
              "transform hover:scale-105 active:scale-95",
              "hover:shadow-md",
              isEditing && !hasChanges() ? "opacity-50 cursor-not-allowed" : "hover:-translate-y-0.5"
            )}
          >
            {loading ? 'Saving...' : isEditing ? (
              hasChanges() ? 'Update Attendance' : 'Up to Date'
            ) : 'Save Attendance'}
          </Button>
        </div>
      </div>

      <div className={clsx(
        styles.layout.grid, 
        'md:grid-cols-4 gap-4 md:gap-6',
        styles.layout.section
      )}>
        <StatsCard label="Total Members" value={stats.total} variant="white" />
        <StatsCard label="Present" value={stats.present} variant="success" />
        <StatsCard label="Late" value={stats.late} variant="warning" />
        <StatsCard label="Absent" value={stats.absent} variant="danger" />
      </div>

      <div className={clsx(styles.table.wrapper, 'bg-white shadow-sm')}>
        <table className="w-full">
          <thead className={styles.table.header}>
            <tr>
              <th className={clsx(styles.table.headerCell, 'w-1/2')}>Name</th>
              <th className={clsx(styles.table.headerCell, 'text-center w-1/2')}>Status</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member, index) => (
              <tr 
                key={member._id} 
                className={clsx(
                  styles.table.row,
                  'hover:bg-gray-50 transition-colors duration-150',
                  index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                )}
              >
                <td className={clsx(styles.table.cell, 'font-medium')}>
                  <Text>{member.firstName} {member.lastName}</Text>
                </td>
                <td className={clsx(styles.table.cell, 'text-center')}>
                  <div className="inline-flex shadow-sm rounded-lg">
                    {Object.values(AttendanceStatus).map((status) => (
                      <StatusSwitch
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
    </div>
  );
};

export default Attendance; 