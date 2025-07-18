import { useAppStore } from '@/store'
import { AvatarImage, Avatar } from '@radix-ui/react-avatar';
import React from 'react'
import { HOST } from '@/utils/constants';
import { getColor } from '@/lib/utils';

const ContactList = ({contacts, isChannel=false }) => {
    // console.log("ContactList received contacts:", contacts);

    const {selectedChatData, setSelectedChatData, setSelectedChatType, selectedChatType, setSelectedChatMessages} = useAppStore();

    const handleClick = (contact)=>{
        if(isChannel) setSelectedChatType("channel");
        else setSelectedChatType("contact");
        setSelectedChatData(contact);
        if(selectedChatData && selectedChatData._id !== contacts._id){
            setSelectedChatMessages([]);
        }
    };
    // What above will do is whenever a chat selected and then other selected we will clear those previos messages.

  return (
    <div className='mt-5'>
        {contacts.map((contact) => (
            <div key={contact._id} className={`pl-10 py-2 transition-all duratoin-300 cursor-pointer ${selectedChatData && selectedChatData._id === contact._id 
            ? "bg-[#8417ff] hover:bg-[#8417ff]" 
            : "hover:bg-[#f1f1f111]" }`
        } onClick={() => handleClick(contact)}
    >
        <div className='flex gap-5 items-center justify-start text-neutral-300'>
            {
                !isChannel && (
                <Avatar className="h-10 w-10 rounded-full overflow-hidden ">
                  {contact.image ? (
                    <AvatarImage
                      src={`${HOST}/${contact.image}`}
                      alt="profile"
                      className="object-cover w-full h-full bg-black rounded-full"
                    />
                  ) : (
                    <div
                      className={`
                      ${selectedChatData && selectedChatData._id === contact._id ? "bg-[ffffff22] border border-white/70 " : getColor(contact.color)}
                      uppercase h-10 w-10  text-lg border-[1px] flex items-center justify-center rounded-full $
                      `}
                    >
                      {contact.firstName
                        ? contact.firstName.split("").shift()
                        : contact.email.split("").shift()}
                    </div>
                  )}
                </Avatar>
            )}    
            {
                isChannel && <div className='bg-[#ffffff22] h-10 w-10 flex items-center justify-center rounded-full'>#</div>
                
            }
            {
                isChannel ? <span>{contact.name}</span> : <span>{contact.firstName ? `${contact.firstName} ${contact.lastName}` : contact.email}</span>
            }
        
        </div>
            
    </div>
        ))}
    </div>
  );
};

export default ContactList;