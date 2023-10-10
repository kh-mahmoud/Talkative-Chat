export const getSender = (loggedUser, users) => {
    return users[0]?.id === loggedUser?.id ? users[1].name : users[0].name;
  };

  export const getSenderFull = (loggedUser, users) => {
    return users[0]?.id === loggedUser?.id ? users[1] : users[0];
  
  };

  export const isSameSender = (messages, m, i, userId) => {
    return (
      i < messages?.length - 1 &&
      (messages[i + 1].sender.id !== m.sender.id ||
        messages[i + 1].sender.id === undefined) &&
      messages[i].sender.id !== userId
    );
  };

  export const isLastMessage = (messages,m, i) => {
    return (
      i === messages.length - 1 &&
      messages[messages.length - 1].sender.id
    );
  };

  export const isSameUser = (messages, m, i) => {
    return i > 0 && messages[i - 1].sender._id === m.sender._id;
  };

  
  export const isSameSenderMargin = (messages, m, i, userId) => {
    // console.log(i === messages.length - 1);
  
    if (
      i < messages.length - 1 &&
      messages[i + 1].sender._id === m.sender._id &&
      messages[i].sender._id !== userId
    )
      return 33;
    else if (
      (i < messages.length - 1 &&
        messages[i + 1].sender._id !== m.sender._id &&
        messages[i].sender._id !== userId) ||
      (i === messages.length - 1 && messages[i].sender._id !== userId)
    )
      return 0;
    else return "auto";
  };
  