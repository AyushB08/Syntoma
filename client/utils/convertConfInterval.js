const convertConfInterval = (interval, modeltype) => {
    if (modeltype === "knee") {
      if (interval === "confidence_1") {
        return { text: "Healthy", subtext: "Our model does not detect knee osteoarthritis in this X-ray image. However, further medical evaluation is recommended." };
      } else if (interval === "confidence_2") {
        return { text: "Moderate", subtext: "Our model detects moderate knee osteoarthritis in this X-ray image. However, further medical evaluation is recommended." };
      } else if (interval === "confidence_3") {
        return { text: "Severe", subtext: "Our model detects severe knee osteoarthritis in this X-ray image. However, further medical evaluation is recommended." };
      }
      return { text: "error", subtext: "" };
    } else {
      return { text: "error", subtext: "" };
    }
  };
  
  export default convertConfInterval;
  