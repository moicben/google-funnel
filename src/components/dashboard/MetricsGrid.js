import { Users, Calendar, CheckCircle, Eye } from 'lucide-react';

const MetricCard = ({ title, value, percentage, icon: Icon, colorClass }) => (
  <div className="metric-card">
    <div className="metric-card-content">
      <div className="metric-card-text">
        <h3>{title}</h3>
        <p className="metric-card-value">
          {typeof value === 'number' ? value.toLocaleString('fr-FR') : value}
        </p>
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
  
  const { totalStats, conversionRates } = stats;
  
  const metrics = [
    {
      title: "Total des visites",
      value: totalStats.visits,
      icon: Eye,
      colorClass: "blue",
      percentage: 100
    },
    {
      title: "Connexions", 
      value: totalStats.logins,
      icon: Users,
      colorClass: "green",
      percentage: conversionRates.visitToLogin
    },
    {
      title: "Vérifications",
      value: totalStats.verifications,
      icon: CheckCircle,
      colorClass: "yellow",
      percentage: conversionRates.loginToVerification
    },
    {
      title: "Réservations",
      value: totalStats.bookings,
      icon: Calendar,
      colorClass: "red", 
      percentage: conversionRates.verificationToBooking
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
