export function Card({ children, className = '' }) {
  return <section className={`glass-panel rounded-lg p-5 shadow-[0_14px_36px_rgba(18,33,42,0.08)] ${className}`}>{children}</section>;
}
