interface CardProps {
  title: string;
  value: string | number;
  backgroundColor?: string;
  className?: string;
}

const SummaryCard = ({
  title,
  value,
  backgroundColor,
  className = "",
}: CardProps) => {
  return (
    <div
      className={`card p-4 rounded-lg shadow-md text-white ${className}`}
      style={backgroundColor ? { backgroundColor } : undefined}
    >
      <h3 className="text-lg font-semibold mb-2">{title}:</h3>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
};

export default SummaryCard;
