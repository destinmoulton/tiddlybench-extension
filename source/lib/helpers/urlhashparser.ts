function getAllHashParams() {
    return new URLSearchParams(window.location.hash.substr(1));
}

function getHashParamValue(name: string) {
    const urlParams = getAllHashParams();
    return urlParams.get(name);
}

export default { getAllHashParams, getHashParamValue };
export { getAllHashParams, getHashParamValue };
