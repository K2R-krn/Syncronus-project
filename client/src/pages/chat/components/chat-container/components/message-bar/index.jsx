

const MessageBar = () => {
  return (
    <div className="h-[10vh] bg-[#1c1d25] flex justify-center px-8 mb-6 gap-6">
        <div className="flex-1 flex bg-[#2a2b33] rounded-md items-center gap-5 pr-5">
            <input type="text" className="flex-1 p-5 bg-transparent rounded-md focus:border-none focus:outline-none" placeholder="Enter Message"></input>
        </div>
    </div>
  )
}

export default MessageBar