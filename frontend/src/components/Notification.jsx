
function Notification({ text, color }) {
  return (
    <div className='flex justify-center '>
      <div className={`fixed top-2 ${color} min-w-[10vw] p-3 rounded-xl text-white text-center`}>
        {text}
      </div>
    </div>
  )
}

export default Notification
