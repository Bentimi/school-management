const uniqueCheck = (value) => {
    const cleanValue = String(value).trim();
    const escapeValue = cleanValue.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const safeValue = new RegExp(`^${escapeValue}$`, "i")
    console.log(safeValue)
    return safeValue
}

module.exports ={
    uniqueCheck
}