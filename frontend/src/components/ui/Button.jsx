function Button({ type = 'button', onClick, variant = "default", className = '', disabled = false, width="full", size = "default", ...props }) {
  const variantClasses = {
    default: "bg-[#20232D] hover:bg-[#3E414B] text-white ",
    light: "border-[1px] border-[#E2E4E9] hover:border-[#CED0D5] text-[#525866]",
    disabled: "bg-[#F6F8FA] text-[#868C98]",
    red: "border-[1px] border-[#fcb1b1] hover:border-[#f74d4d] text-[#f74d4d]",
    trial:'bg-orange-600 hover:bg-orange-500 text-white',
    expire:'bg-red-600 hover:bg-red-500 text-white'
  };
  const sizeClasses = {
    default: "px-4 py-2.5",
    even: "px-2.5 py-2.5",
    large: 'px-[12px] py-[10px] flex items-center  justify-center',
    subscription:'px-4 py-2.5 md:px-[12px] md:py-[4px] flex items-center  justify-center'
  };

  return (
    <button
      onClick={onClick}
      type={type}
      disabled={disabled}
      className={`text-sm center w-${width} ${variantClasses[variant]} ${className} rounded-[10px] `}
    >
      <div className={`${sizeClasses[size]}`}>{props.children}</div>
    </button>
  );
}

export default Button;
