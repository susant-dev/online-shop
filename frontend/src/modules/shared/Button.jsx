const Button = (props) => {
  const { text, onClick, children, className, style, type } = props;
  return (
    <button
      type={type}
      className={className ? "btn " + className : "btn"}
      onClick={
        onClick
          ? (e) => {
              e.preventDefault();
              onClick();
            }
          : undefined
      }
      style={style}
    >
      {children || text}
    </button>
  );
};

export default Button;
