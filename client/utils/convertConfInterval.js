const convertConfInterval = (interval, modeltype) => {
    if (modeltype == "knee") {
        if (interval == "confidence_1") {
            return "healthy";
        }
        else if (interval == "confidence_2") {
            return "moderate";
        }
        else if (interval == "confidence_3") {
            return "severe";
        }
        
        
        return "error";
        
    } else {
        return "error";
    }
    

};

export default convertConfInterval;