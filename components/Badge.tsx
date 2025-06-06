import { Currency } from "@/lib/types";
import { currencyStyles, cn } from "@/lib/utils";

export const CurrencyBadge = ({ currency }: { currency: Currency }) => {
  const { borderColor, textColor, chipBackgroundColor } =
    currencyStyles[currency] || currencyStyles.USD;

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border",
        borderColor,
        chipBackgroundColor
      )}
    >
      <span className={textColor}>{currency}</span>
    </div>
  );
};

interface BadgeProps {
  label: string;
  variant: string;
  styleMap: Record<string, any>;
  showDot?: boolean;
}

export const Badge = ({
  label,
  variant,
  styleMap,
  showDot = false,
}: BadgeProps) => {
  const { borderColor, backgroundColor, textColor, chipBackgroundColor } =
    styleMap[variant] || styleMap.default;

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border",
        borderColor,
        chipBackgroundColor
      )}
    >
      {showDot && (
        <div className={cn("w-3 h-3 rounded-full", backgroundColor)} />
      )}
      <span className={textColor}>{label}</span>
    </div>
  );
};
