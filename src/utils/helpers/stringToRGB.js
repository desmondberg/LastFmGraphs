//FUNCTION FOR CONVERTING A STRING INTO AN RGB VALUE

const stringToRGB = (str) => {
    // Hash the string to a single number
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }

    // Extract RGB values from the hash
    const r = (hash >> 16) & 0xFF;
    const g = (hash >> 8) & 0xFF;
    const b = hash & 0xFF;

    return `rgb(${r}, ${g}, ${b})`;
}
export default stringToRGB;