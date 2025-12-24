export const calculateleetcodeScore = ({ easy, medium, hard }) => {
    return easy * 100 + medium * 200 + hard * 300
}


export const calculateCodeForcesScore = ({ solved, rating }) => {
    let multiple = 100;
    if (rating >= 1000) {
        multiple = 300;
    } else if (rating >= 600) {
        multiple = 200;
    }

    return solved * multiple
}
