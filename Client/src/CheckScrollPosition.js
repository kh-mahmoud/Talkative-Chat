

export const checkScrollPosition = (scrollableFeedRef,setIsAtBottom) => {
    if (scrollableFeedRef.current) {
    const scrollHeight = scrollableFeedRef.current.scrollHeight;
    const height = scrollableFeedRef.current.clientHeight;
    const maxScrollTop = scrollHeight - height;

    // Check if the current scrollTop is close to the maximum scrollTop (with a small buffer)
    const atBottom = scrollableFeedRef.current.scrollTop >= maxScrollTop - 80; // Adjust the buffer as needed

    // Update the state based on the scroll position
    setIsAtBottom(atBottom);
    }
};