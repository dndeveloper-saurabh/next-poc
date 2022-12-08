export const hourToStrFormat = (hour) => {
  if (hour === 12) return "12:00 PM";
  else if (hour > 12) return `${hour - 12}:00 PM`;
  else if (hour < 12) return `${hour}:00 AM`;
};
