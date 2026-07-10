export default function Button({ children, onClick, type = 'button', className = '', ...rest }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`inline-flex items-center justify-center transition ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
