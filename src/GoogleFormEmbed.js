import React from 'react';

function GoogleFormsEmbed() {
  return (
    <div>
      <iframe
        src="https://docs.google.com/forms/d/e/1FAIpQLSegNQZQi2Hvt7bJs4hVEqfZaO4KF8BjIrle-PjvO5cSTC6nSw/viewform?usp=sf_link"
        width="100%"
        height="800px" // You can adjust the height as needed
        frameborder="0"
        marginheight="0"
        marginwidth="50px"
        title="Google Form"
      >
        Loading...
      </iframe>
    </div>
  );
}

export default GoogleFormsEmbed;