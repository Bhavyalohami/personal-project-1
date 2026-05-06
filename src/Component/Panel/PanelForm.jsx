const PanelForm = ({
  title,
  description,
  children,
  footer,
  onSubmit,
  className = "",
}) => (
  <form
    onSubmit={onSubmit}
    className={`rounded-[2rem] border border-[#67E8F9]/50 bg-white p-5 shadow-xl shadow-teal-900/10 sm:p-7 ${className}`}
  >
    {(title || description) && (
      <div className="mb-7 border-b border-[#67E8F9]/35 pb-5">
        {title && <h2 className="text-2xl font-black text-[#134E4A]">{title}</h2>}
        {description && (
          <p className="mt-2 max-w-2xl text-sm font-semibold leading-6 text-[#134E4A]/65">
            {description}
          </p>
        )}
      </div>
    )}
    <div className="panel-form-fields">{children}</div>
    {footer && <div className="mt-7 flex flex-wrap justify-end gap-3">{footer}</div>}
  </form>
);

export default PanelForm;
