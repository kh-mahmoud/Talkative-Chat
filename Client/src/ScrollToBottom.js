
     // Function to scroll the div to the bottom smoothly
     export const scrollToBottom = (scrollableFeedRef) => {
        if (scrollableFeedRef?.current) {
          const scrollHeight = scrollableFeedRef.current?.scrollHeight;
          const height = scrollableFeedRef.current?.clientHeight;
          const maxScrollTop = scrollHeight - height;
          const animationDuration = 50; // Adjust as needed
    
          // Calculate the number of steps for smooth scrolling
          const numSteps = Math.floor(animationDuration / 16); // 16ms per frame
    
          // Calculate the scroll increment for each step
          const scrollStep = maxScrollTop / numSteps;
    
          // Perform smooth scrolling
          const smoothScroll = () => {
            if (scrollableFeedRef.current?.scrollTop < maxScrollTop) {
              scrollableFeedRef.current.scrollTop += scrollStep;
              requestAnimationFrame(smoothScroll);
            }
          };
    
          requestAnimationFrame(smoothScroll);
        }
      };
