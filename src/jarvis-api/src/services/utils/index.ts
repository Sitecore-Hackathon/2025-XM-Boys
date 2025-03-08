export const generateUid = () => {
    const s4 = () => {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1)
            .toUpperCase();
    };
    return `{${s4()}${s4()}-${s4()}-${s4()}-${s4()}-${s4()}${s4()}${s4()}}`;
};

export const formatUid = (uid: string): string => {
    const cleanUid = uid.replace(/[{}]/g, "").toUpperCase();
    return `{${cleanUid}}`;
};
