import React,{useState,useEffect} from 'react';

export default function SusbcribeBtn({userId}) {
    const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    // Check if current user is subscribed to the displayed user (userId)
    // Fetch subscription status from the backend or any appropriate source
    // Update isSubscribed state based on the fetched status
    const fetchSubscriptionStatus = async () => {
      // Example: Fetch subscription status from the backend
      const response = await fetch(`http://localhost:8080/subscriptionStatus/${userId}`,{
        credentials: 'include',
      });
      const data = await response.json();
      console.log(data);
      setIsSubscribed(data.isSubscribed);
    };

    fetchSubscriptionStatus();
  }, [userId]);

  const handleSubscriptionToggle = async () => {
    // Send subscription/unsubscription request to the backend
    // Update isSubscribed state based on the response
    const action = isSubscribed ? 'unsubscribe' : 'subscribe';
    const response = await fetch(`http://localhost:8080/subscriptions/${userId}/${action}`, { 
        method: 'POST',
        credentials: 'include'
    });
    const data = await response.json();
    setIsSubscribed(data.isSubscribed);
  };

  return (
    (isSubscribed !== "same")&&
    <button onClick={handleSubscriptionToggle} disabled={isSubscribed === 'same'} className="btn btn-secondary w-50">
        {isSubscribed ? 'Unsubscribe' : 'Subscribe'}
    </button>
  )
}
