import { useState, useEffect } from "react"


export default function useTime() {
     const [now, setNow] = useState(new Date());
    
      useEffect(() => {
        const interval = setInterval(() => {
          setNow(new Date());
        }, 1000);
    
        return () => clearInterval(interval);
      }, []);
    
      const time = now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    
      const date = now.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
      });

      return { time, date }
    
}