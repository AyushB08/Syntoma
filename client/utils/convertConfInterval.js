const convertConfInterval = (interval, modeltype) => {
    if (modeltype == "knee") {
        if (interval == "confidence_1") {
            return "healthy";
        }
        else if (interval == "confidence_2") {
            return "doubtful";
        }
        else if (interval == "confidence_3") {
            return "minimal";
        }
        else if (interval == "confidence_4") {
            return "moderate";
        }
        else {
            return "severe";
        }
    } else {
        return "error";
    }
    

};

export default convertConfInterval;