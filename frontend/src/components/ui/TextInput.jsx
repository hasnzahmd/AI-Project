function TextInput({ name, label, required, placeholder, type = "text", value, onChange, textArea = false, preIcon, postIcon, width, useWidthOnMobile = true}) {
  if (textArea) {
    return (
      <div className="flex flex-col text-sm gap-1 w-full">
        <label className="font-medium text-[14px]">{label}</label>
        <textarea
          rows={3}
          required={required}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="rounded-[10px] inputFieldShadow text-[14px] font-SuisseIntlLight font-normal text-[#868C98] border-[1px] py-2.5 px-4 border-[#E2E4E9] hover:border-[#CED0D5] focus:border-[#A6A8AD] focus:ring-0 focus:outline-none w-full"
        />
      </div>
    );
  }
  return (
    <div className={`relative flex flex-col text-sm ${label ? "gap-1" : "h-[42px]"} w-full`}>
      {label && (
        <label className="font-medium text-[14px]">{label}</label>
      )}
      <input
        required={required}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`rounded-[10px] inputFieldShadow text-[14px] font-SuisseIntlLight font-normal text-[#868C98] border-[1px] py-2.5 px-4 ${preIcon ? "pl-9" : ""} ${postIcon ? "pr-9" : ""} border-[#E2E4E9] hover:border-[#CED0D5] focus:border-[#A6A8AD] focus:ring-0 focus:outline-none ${width ? `${useWidthOnMobile ? "" : "sm:"}w-[${width}]` : "w-full"}`}
      />
      {preIcon && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {preIcon}
        </div>
      )}
      {postIcon && (
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
          {postIcon}
        </div>
      )}
    </div>
  );
}

export default TextInput;
