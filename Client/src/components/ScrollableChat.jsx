import { UserContext } from '../context/UserProvider';
import { Avatar, Box, Collapse, Tooltip, useDisclosure } from '@chakra-ui/react';
import ScrollableFeed from 'react-scrollable-feed';
import { useEffect, useRef, useState } from 'react';
import { scrollToBottom } from '../ScrollToBottom';
import { checkScrollPosition } from '../CheckScrollPosition';
import { ArrowDownIcon } from '@chakra-ui/icons';
import { AnimatePresence, motion } from 'framer-motion';
import Lottie from 'lottie-react';
import Dotes from "../animation/Dotes.json";
import Hey from "../animation/Hey.json";
import { format } from 'timeago.js';
import moment from "moment"


const ScrollableChat = ({ messages, state, istyping }) => {
  const { auth } = UserContext();
  const scrollableFeedRef = useRef(null);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [isOpen, setIsOpen] = useState({});
  const [selectedDiv, setSelectedDiv] = useState(null);


  useEffect(() => {
    scrollToBottom(scrollableFeedRef);
  }, [messages]);

  useEffect(() => {
    if (istyping && isAtBottom) scrollToBottom(scrollableFeedRef);
    if (isOpen && isAtBottom) scrollToBottom(scrollableFeedRef);

  }, [istyping,isOpen]);

  

  const handleclick = (index) => {
    setIsOpen((prevOpen) => ({
      ...prevOpen,[index]: !prevOpen[index],
    }));
    setSelectedDiv(index);
  };

  const formatTimestamp = (timestamp) => {
    return moment(timestamp).fromNow(); // Format the timestamp as a relative time (e.g., "2 minutes ago")
  };

  return (
    <div
      onScroll={() => checkScrollPosition(scrollableFeedRef, setIsAtBottom)}
      ref={scrollableFeedRef}
      className='h-full scrollbar-hide overflow-scroll relative'
    >
      <div className='flex w-full items-center flex-col '>
        <Lottie style={{ width: '80px', height: '80px' }} animationData={Hey} loop={true} />
        <h1>Say Hi, and start your chat</h1>
      </div>
      {messages &&
        messages?.map((m, i) => (
          <div key={i} className='w-auto'>
            <Box className={`flex gap-x-2 flex-row items-center mt-3  ${m.sender.id !== auth.user.id && "flex-row-reverse"}`} >
              <Tooltip label={m.sender.name} placement="bottom-start" hasArrow>
                <Avatar
                  onClick={() => handleclick(i)}
                  size="sm"
                  cursor="pointer"
                  name={m.sender.name}
                  src={m.sender.pic}
                />
              </Tooltip>
              <span
                style={{
                  backgroundColor: `${
                    m.sender.id === auth.user.id ? "#BEE3F8" : "#B9F5D0"
                  }`,
                  borderRadius: "20px",
                  padding: "5px 15px",
                  maxWidth: "75%",
                }}
              >
                {m.content}
              </span>
            </Box>
            {/* {messages?.length - 1 == i && m.sender.id === auth.user.id && (state ? "sent":"wait")} */}
            <Box className={`flex mx-12 mt-1 ${m.sender.id !== auth.user.id && "flex-row-reverse"} `}>
              <Collapse  in={isOpen[i]} animateOpacity>
                  {formatTimestamp(m.createdAt)} 
              </Collapse>
            </Box>

          </div>
        ))}
      {istyping && <span className='flex flex-row-reverse mt-2 '> <Lottie style={{ width: '40px', height: '40px' }} animationData={Dotes} loop={true} /></span>}
      <AnimatePresence>
        {!isAtBottom &&
          <div onClick={() => scrollToBottom(scrollableFeedRef)} className="sticky bottom-1 w-full flex justify-center">
            <motion.div animate={{ y: -5, opacity: 1 }} className='bg-slate-400 z-40 cursor-pointer h-[40px] flex justify-center items-center w-[40px] rounded-full'>
              <ArrowDownIcon />
            </motion.div>
          </div>
        }
      </AnimatePresence>
    </div>
  );
};

export default ScrollableChat;
