const convertConfInterval = (interval, modeltype) => {
  if (modeltype === "knee") {
      if (interval === "confidence_1") {
          return { text: "Healthy", subtext: "Our model does not detect knee osteoarthritis in this X-ray image. Further medical evaluation is recommended." };
      } else if (interval === "confidence_2") {
          return { text: "Moderate", subtext: "Our model detects moderate knee osteoarthritis in this X-ray image. Further medical evaluation is recommended." };
      } else if (interval === "confidence_3") {
          return { text: "Severe", subtext: "Our model detects severe knee osteoarthritis in this X-ray image. Further medical evaluation is recommended." };
      }
      return { text: "error", subtext: "" };
  } else if (modeltype === "chest") {
      if (interval === "confidence_1") {
          return { text: "Atelectasis", subtext: "Our model detects signs of Atelectasis in this X-ray image. Further medical evaluation is recommended." };
      } else if (interval === "confidence_2") {
          return { text: "Cardiomegaly", subtext: "Our model detects signs of Cardiomegaly in this X-ray image. Further medical evaluation is recommended." };
      } else if (interval === "confidence_3") {
          return { text: "Consolidation", subtext: "Our model detects signs of Consolidation in this X-ray image. Further medical evaluation is recommended." };
      } else if (interval === "confidence_4") {
          return { text: "Edema", subtext: "Our model detects signs of Edema in this X-ray image. Further medical evaluation is recommended." };
      } else if (interval === "confidence_5") {
          return { text: "Effusion", subtext: "Our model detects signs of Effusion in this X-ray image. Further medical evaluation is recommended." };
      } else if (interval === "confidence_6") {
          return { text: "Emphysema", subtext: "Our model detects signs of Emphysema in this X-ray image. Further medical evaluation is recommended." };
      } else if (interval === "confidence_7") {
          return { text: "Fibrosis", subtext: "Our model detects signs of Fibrosis in this X-ray image. Further medical evaluation is recommended." };
      } else if (interval === "confidence_8") {
          return { text: "Infiltration", subtext: "Our model detects signs of Infiltration in this X-ray image. Further medical evaluation is recommended." };
      } else if (interval === "confidence_9") {
          return { text: "Mass", subtext: "Our model detects signs of Mass in this X-ray image. Further medical evaluation is recommended." };
      } else if (interval === "confidence_10") {
          return { text: "Nodule", subtext: "Our model detects signs of Nodule in this X-ray image. Further medical evaluation is recommended." };
      } else if (interval === "confidence_11") {
          return { text: "Pleural Thickening", subtext: "Our model detects signs of Pleural Thickening in this X-ray image. Further medical evaluation is recommended." };
      } else if (interval === "confidence_12") {
          return { text: "Pneumonia", subtext: "Our model detects signs of Pneumonia in this X-ray image. Further medical evaluation is recommended." };
      } else if (interval === "confidence_13") {
          return { text: "Pneumothorax", subtext: "Our model detects signs of Pneumothorax in this X-ray image. Further medical evaluation is recommended." };
      }
      return { text: "error", subtext: "" };
  }
};

export default convertConfInterval;
