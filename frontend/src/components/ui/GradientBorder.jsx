export function GradientBorder({ children, variant = 0 }) {
  let gradients = [
    "from-[#EDEFF2] to-[#FCFCFC]",
    "from-[#0066FF] to-[#0066FF]/0",
    "from-[#00FF94] to-[#01FB921A]/10",
    "from-[#FF7E7E] to-[#FF484800]",
  ];

  return (
    <div
      className={`p-4 rounded-full flex items-center shadow-inner justify-center bg-gradient-to-b ${gradients[variant]}`}
    >
      {children}
    </div>
  );
}
