import React, { useEffect, useState } from 'react';

export default function PageLoadingBar() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    // The animation takes 0.6s. We can unmount or hide it after some delay if needed,
    // or just let it finish. The CSS handles opacity: 0 at the end.
    const timer = setTimeout(() => setShow(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (!show) return null;

  return <div className="page-loading-bar" />;
}
