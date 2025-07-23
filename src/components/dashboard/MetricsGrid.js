import { Users, Calendar, CheckCircle, Eye, UserCheck, LogIn } from 'lucide-react';

const MetricCard = ({ title, value, percentage, icon: Icon, colorClass, subInfo }) => (
  <div className="metric-card">
    <div className="metric-card-content">
      <div className="metric-card-text">
        <h3>{title}</h3>
        <p className="metric-card-value">
          {typeof value === 'number' ? value.toLocaleString('fr-FR') : value}
        </p>
        {subInfo && (
          <p className="metric-card-subinfo">
            <Eye style={{ width: 14, height: 14, display: 'inline', marginRight: 4 }} />
            {subInfo.visits.toLocaleString('fr-FR')} vues ({subInfo.percentage.toFixed(1)}%)
          </p>
        )}
        {percentage !== undefined && percentage !== null && (
          <p className="metric-card-percentage">
            {percentage.toFixed(1)}% de conversion
          </p>
        )}
      </div>
      <div className={`metric-card-icon ${colorClass}`}>
        <Icon />
      </div>
    </div>
  </div>
);

const MetricsGrid = ({ stats }) => {
  if (!stats) return null;
  
  const { totalStats } = stats;
  
  // Calculer les taux de conversion basés sur les contacts
  const contactToLogin = totalStats.contacts > 0 ? ((totalStats.logins / totalStats.contacts) * 100) : 0;
  const contactToVerification = totalStats.contacts > 0 ? ((totalStats.verifications / totalStats.contacts) * 100) : 0;
  const contactToBooking = totalStats.contacts > 0 ? ((totalStats.bookings / totalStats.contacts) * 100) : 0;
  const visitToContact = totalStats.visits > 0 ? ((totalStats.contacts / totalStats.visits) * 100) : 0;
  
  const metrics = [
    {
      title: "Contacts",
      value: totalStats.contacts,
      icon: UserCheck,
      colorClass: "purple",
      subInfo: {
        visits: totalStats.visits,
        percentage: visitToContact
      }
    },
    {
      title: "Connexions", 
      value: totalStats.logins,
      icon: LogIn,
      colorClass: "blue",
      percentage: contactToLogin
    },
    {
      title: "Vérifications",
      value: totalStats.verifications,
      icon: CheckCircle,
      colorClass: "green",
      percentage: contactToVerification
    },
    {
      title: "Réservations",
      value: totalStats.bookings,
      icon: Calendar,
      colorClass: "yellow", 
      percentage: contactToBooking
    }
  ];
  
  return (
    <div className="metrics-grid">
      {metrics.map((metric, index) => (
        <MetricCard key={index} {...metric} />
      ))}
    </div>
  );
};

export default MetricsGrid;
